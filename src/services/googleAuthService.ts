
import { User } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { authenticateUser, getCurrentIpAddress, getIPLocation } from './loginService';

// Function to initialize Google Sign-In
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google API script is already loaded
    if (window.google) {
      resolve();
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.head.appendChild(script);
  });
};

// Function to authenticate with Google
export const authenticateWithGoogle = async (): Promise<User | null> => {
  try {
    await initializeGoogleAuth();

    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '953313590514-stufb46q1pmi8bkj4jg2sjdbvtd9nk5d.apps.googleusercontent.com',
        scope: 'email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(`Authentication failed: ${tokenResponse.error}`));
            return;
          }

          try {
            // Get user info from Google
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!response.ok) {
              throw new Error('Failed to fetch user information');
            }

            const googleUser = await response.json();
            const email = googleUser.email;

            if (!email) {
              throw new Error('Email not provided by Google');
            }

            // Use the existing authentication flow with the email from Google
            // The system will check if this email exists in the approved investor database
            const userData = await authenticateUser(email, '', true);
            resolve(userData);
          } catch (error) {
            console.error('Google authentication error:', error);
            reject(error);
          }
        }
      });

      client.requestAccessToken();
    });
  } catch (error) {
    console.error('Google authentication initialization error:', error);
    toast.error('Failed to initialize Google authentication. Please try again.');
    return null;
  }
};
