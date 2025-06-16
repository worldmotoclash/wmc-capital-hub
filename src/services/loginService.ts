
import { User } from '@/contexts/UserContext';
import { toast } from 'sonner';

// Cache duration in milliseconds (24 hours)
const IP_CACHE_DURATION = 24 * 60 * 60 * 1000;

// Function to get the user's current IP address with multiple fallback services
export const getCurrentIpAddress = async (): Promise<string> => {
  const ipServices = [
    'https://api.ipify.org?format=json',
    'https://ipinfo.io/json',
    'https://api.my-ip.io/ip.json',
    'https://httpbin.org/ip'
  ];

  for (let i = 0; i < ipServices.length; i++) {
    try {
      console.log(`Attempting to get IP from service ${i + 1}: ${ipServices[i]}`);
      const response = await fetch(ipServices[i]);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      let ip = '';
      
      // Handle different response formats
      if (data.ip) {
        ip = data.ip;
      } else if (data.origin) {
        ip = data.origin; // httpbin format
      } else if (typeof data === 'string') {
        ip = data;
      }
      
      // Normalize IP (trim whitespace)
      ip = ip.trim();
      
      console.log(`Successfully got IP from service ${i + 1}: "${ip}"`);
      
      if (ip && ip.length > 0) {
        return ip;
      }
    } catch (error) {
      console.error(`Error fetching IP from service ${i + 1} (${ipServices[i]}):`, error);
      if (i === ipServices.length - 1) {
        console.error('All IP services failed');
        return '';
      }
    }
  }
  
  return '';
};

// Function to get location information from IP address with caching
interface IPLocation {
  country: string;
  city: string;
  timestamp: number;
}

export const getIPLocation = async (ip: string): Promise<{country: string, city: string}> => {
  try {
    // Check if we have cached data
    const cachedData = localStorage.getItem(`ip_location_${ip}`);
    
    if (cachedData) {
      const parsedData: IPLocation = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // If cache isn't expired, use it
      if (now - parsedData.timestamp < IP_CACHE_DURATION) {
        console.log('Using cached IP location data');
        return {
          country: parsedData.country,
          city: parsedData.city
        };
      }
    }
    
    // Fetch new data from a secure HTTPS API
    console.log('Fetching IP location data from API');
    // Using ipapi.co which supports HTTPS
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP location data');
    }
    
    const data = await response.json();
    
    // Cache the result
    const locationData: IPLocation = {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem(`ip_location_${ip}`, JSON.stringify(locationData));
    
    return {
      country: locationData.country,
      city: locationData.city
    };
  } catch (error) {
    console.error('Error fetching IP location:', error);
    
    // Fallback to another API if first one fails
    try {
      console.log('Attempting fallback geolocation API');
      const fallbackResponse = await fetch(`https://ipinfo.io/${ip}/json`);
      
      if (!fallbackResponse.ok) {
        throw new Error('Fallback API also failed');
      }
      
      const fallbackData = await fallbackResponse.json();
      
      const locationData: IPLocation = {
        country: fallbackData.country ? (fallbackData.country_name || fallbackData.country) : 'Unknown',
        city: fallbackData.city || 'Unknown',
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(`ip_location_${ip}`, JSON.stringify(locationData));
      
      return {
        country: locationData.country,
        city: locationData.city
      };
    } catch (fallbackError) {
      console.error('Fallback geolocation also failed:', fallbackError);
      return {
        country: 'Unknown',
        city: 'Unknown'
      };
    }
  }
};

// Fetch investor data from the API
export const fetchInvestorData = async () => {
  const apiUrl = `https://api.realintelligence.com/api/specific-investor-list.py?orgId=00D5e000000HEcP&campaignId=7014V000002lcY2&sandbox=False`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error('Failed to fetch investor data');
  }
  
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType?.includes('xml')) {
    // Parse XML response
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const memberElements = xmlDoc.getElementsByTagName('member');
    
    return Array.from(memberElements).map(member => ({
      id: member.getElementsByTagName('id')[0]?.textContent || '',
      email: member.getElementsByTagName('email')[0]?.textContent || '',
      ripassword: member.getElementsByTagName('ripassword')[0]?.textContent || '',
      name: member.getElementsByTagName('name')[0]?.textContent || '',
      status: member.getElementsByTagName('status')[0]?.textContent || '',
      phone: member.getElementsByTagName('phone')[0]?.textContent || '',
      mobile: member.getElementsByTagName('mobile')[0]?.textContent || '',
      mailingstreet: member.getElementsByTagName('mailingstreet')[0]?.textContent || '',
      ipaddress: member.getElementsByTagName('ipaddress')[0]?.textContent || ''
    }));
  } else {
    // Assume JSON response
    return await response.json();
  }
};

// Send a verification email when IP doesn't match
export const sendVerificationEmail = async (contactId: string, ipInfo?: {ip: string, country: string, city: string}): Promise<boolean> => {
  try {
    console.log('Sending verification email for contact ID:', contactId);
    
    // Create a hidden iframe element
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Set up the tracking endpoint
    const verificationEndpoint = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/update-engine-contact.php";
    
    // Wait for iframe to load
    await new Promise(resolve => {
      iframe.onload = resolve;
      iframe.src = 'about:blank';
    });
    
    // Get the iframe document
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (iframeDoc) {
      // Create a form in the iframe
      const form = iframeDoc.createElement('form');
      form.method = 'POST';
      form.action = verificationEndpoint;
      form.enctype = 'multipart/form-data';
      
      // Add form fields
      const fields: Record<string, string> = {
        'sObj': 'Contact',
        'id_Contact': contactId,
        'text_IP_Verification_Required__c': 'Yes'
      };
      
      // Add location information if available
      if (ipInfo) {
        fields['text_New_Login_IP__c'] = ipInfo.ip;
        fields['text_New_Login_Country__c'] = ipInfo.country;
        fields['text_New_Login_City__c'] = ipInfo.city;
      }
      
      // Add each field to the form
      Object.entries(fields).forEach(([name, value]) => {
        const input = iframeDoc.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      
      // Add form to iframe document and submit it
      iframeDoc.body.appendChild(form);
      console.log('Submitting verification email request via iframe');
      form.submit();
      
      // Remove iframe after some time to allow the request to complete
      setTimeout(() => {
        document.body.removeChild(iframe);
        console.log('Verification request iframe removed');
      }, 5000);
      
      return true;
    } else {
      console.error('Could not access iframe document');
      return false;
    }
  } catch (error) {
    console.error('Verification email error:', error);
    return false;
  }
};

// Track login activity using an iframe to bypass CORS restrictions
export const trackLogin = async (contactId: string, action: string = 'Login'): Promise<void> => {
  console.log(`[trackLogin] Start: Action: ${action} for contact ID: ${contactId}`);
  
  try {
    // Pre-fetch IP and location data before creating iframe
    const currentIp = await getCurrentIpAddress();
    const locationData = await getIPLocation(currentIp);
    
    console.log(`[trackLogin] IP data fetched: ${currentIp}, Location: ${locationData.city}, ${locationData.country}`);
    
    // Create iframe for tracking
    const trackingIframe = document.createElement('iframe');
    trackingIframe.style.display = 'none';
    
    trackingIframe.onload = () => {
      try {
        const iframeDoc = trackingIframe.contentDocument || trackingIframe.contentWindow?.document;
        if (!iframeDoc) {
          console.error('[trackLogin] Could not access iframe document');
          return;
        }

        const form = iframeDoc.createElement('form');
        form.method = 'POST';
        form.action = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php";
          
        const fields: Record<string, string> = {
          'sObj': 'ri__Portal__c',
          'string_ri__Contact__c': contactId,
          'text_ri__Login_URL__c': 'https://invest.worldmotoclash.com',
          'text_ri__Action__c': action,
          'text_ri__IP_Address__c': currentIp,
          'text_ri__Login_Country__c': locationData.country,
          'text_ri__Login_City__c': locationData.city,
        };

        Object.entries(fields).forEach(([name, value]) => {
          const input = iframeDoc.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });

        iframeDoc.body.appendChild(form);
        console.log(`[trackLogin] Submitting form for: ${action}`);
        form.submit();
        
      } catch (err) {
        console.error('[trackLogin] Error during form creation/submission:', err);
      }
    };
    
    document.body.appendChild(trackingIframe);
    trackingIframe.src = 'about:blank';
    
    // Remove iframe after sufficient time for request to complete
    setTimeout(() => {
      if (document.body.contains(trackingIframe)) {
        document.body.removeChild(trackingIframe);
        console.log(`[trackLogin] Request completed and iframe removed for: ${action}`);
      }
    }, 5000); // 5 seconds to ensure request completes
    
  } catch (error) {
    console.error('[trackLogin] Error:', error);
    // Don't throw error to avoid breaking login flow
  }
};

/**
 * Track document or video views for analytics.
 * @param contactId - The user's contact ID.
 * @param documentUrl - The URL of the document or video clicked.
 * @param actionType - "Video View" | "Document View" | "Website Visit".
 * @param documentTitle - Optional. The title of the document or video.
 */
export const trackDocumentClick = async (
  contactId: string,
  documentUrl: string,
  actionType: string,
  documentTitle?: string
): Promise<void> => {
  console.log(`[trackDocumentClick] ===== STARTING DOCUMENT TRACKING =====`);
  console.log(`[trackDocumentClick] Action: ${actionType}`);
  console.log(`[trackDocumentClick] Title: ${documentTitle || 'N/A'}`);
  console.log(`[trackDocumentClick] URL: ${documentUrl}`);
  console.log(`[trackDocumentClick] Contact ID: ${contactId}`);

  try {
    // Get IP and location data first
    console.log(`[trackDocumentClick] Step 1: Fetching IP and location data...`);
    const currentIp = await getCurrentIpAddress();
    const locationData = await getIPLocation(currentIp);
    
    console.log(`[trackDocumentClick] Step 2: Got IP: ${currentIp}, Location: ${locationData.city}, ${locationData.country}`);
    
    // Store debug info in localStorage
    const trackingData = {
      contactId,
      actionType,
      documentTitle: documentTitle || 'Untitled',
      documentUrl,
      currentIp,
      location: locationData,
      timestamp: new Date().toISOString()
    };
    
    const existingTracking = JSON.parse(localStorage.getItem('document_tracking_debug') || '[]');
    existingTracking.push(trackingData);
    localStorage.setItem('document_tracking_debug', JSON.stringify(existingTracking));
    
    // Create iframe for tracking
    console.log(`[trackDocumentClick] Step 3: Creating tracking iframe...`);
    const trackingIframe = document.createElement('iframe');
    trackingIframe.style.display = 'none';
    trackingIframe.style.position = 'absolute';
    trackingIframe.style.top = '-9999px';
    
    // Set up iframe load handler
    trackingIframe.onload = () => {
      console.log(`[trackDocumentClick] Step 4: Iframe loaded, creating form...`);
      
      try {
        const iframeDoc = trackingIframe.contentDocument || trackingIframe.contentWindow?.document;
        if (!iframeDoc) {
          console.error('[trackDocumentClick] Could not access iframe document');
          return;
        }

        // Create form
        const form = iframeDoc.createElement('form');
        form.method = 'POST';
        form.action = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php";
        form.enctype = 'multipart/form-data';
          
        // Prepare form fields
        const fields: Record<string, string> = {
          'sObj': 'ri__Portal__c',
          'string_ri__Contact__c': contactId,
          'text_ri__Login_URL__c': documentUrl,
          'text_ri__Action__c': actionType,
          'text_ri__IP_Address__c': currentIp,
          'text_ri__Login_Country__c': locationData.country,
          'text_ri__Login_City__c': locationData.city,
        };

        // Add document title if provided
        if (documentTitle) {
          fields['text_ri__Doc_Title__c'] = documentTitle;
        }

        // Add fields to form
        Object.entries(fields).forEach(([name, value]) => {
          const input = iframeDoc.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });

        iframeDoc.body.appendChild(form);
        console.log(`[trackDocumentClick] Step 5: Submitting form for: ${actionType}`);
        form.submit();
        
      } catch (err) {
        console.error('[trackDocumentClick] Error during form creation/submission:', err);
      }
    };
    
    // Add iframe to document and set source
    document.body.appendChild(trackingIframe);
    trackingIframe.src = 'about:blank';
    
    // Clean up iframe after tracking request completes
    setTimeout(() => {
      if (document.body.contains(trackingIframe)) {
        document.body.removeChild(trackingIframe);
        console.log(`[trackDocumentClick] Step 6: Tracking completed and iframe removed for: ${actionType}`);
      }
    }, 5000);
    
    console.log(`[trackDocumentClick] ===== TRACKING INITIATED SUCCESSFULLY =====`);
    
  } catch(error) {
    console.error(`[trackDocumentClick] ===== ERROR OCCURRED =====`, error);
  }
};

// Authenticate user
export const authenticateUser = async (email: string, password: string, isGoogleAuth: boolean = false): Promise<User | null> => {
  try {
    const data = await fetchInvestorData();
    
    console.log('Parsed investor data:', data);
    
    // Find the investor by email (case-insensitive comparison)
    const investor = data.find((inv: any) => 
      inv.email && inv.email.toLowerCase() === email.toLowerCase()
    );
    
    console.log('Found investor:', investor);
    
    if (investor) {
      // For Google Auth, we skip password check
      const isValidPassword = isGoogleAuth || (investor.ripassword && password === investor.ripassword.toString());
      
      if (isValidPassword) {
        // If the investor has an IP address set, validate it
        if (investor.ipaddress && investor.ipaddress.trim() !== '') {
          const storedIp = investor.ipaddress.trim(); // Normalize stored IP
          console.log(`IP validation required. Stored IP (normalized): "${storedIp}"`);
          
          // Get the user's current IP address
          const currentIp = await getCurrentIpAddress();
          console.log(`User's current IP (normalized): "${currentIp}"`);
          
          // Debug the comparison
          console.log(`IP comparison: "${currentIp}" === "${storedIp}" = ${currentIp === storedIp}`);
          console.log(`Current IP length: ${currentIp.length}, Stored IP length: ${storedIp.length}`);
          
          // If we couldn't get the current IP, log it but don't block access
          if (!currentIp || currentIp.length === 0) {
            console.warn('Could not determine current IP address - allowing access');
          } else if (currentIp !== storedIp) {
            console.log('IP mismatch detected. Sending verification email.');
            
            // Get location information for the new IP
            const locationData = await getIPLocation(currentIp);
            
            // Send verification email with location data
            await sendVerificationEmail(investor.id, {
              ip: currentIp,
              country: locationData.country,
              city: locationData.city
            });
            
            // Also track the IP mismatch event
            await trackLogin(investor.id, isGoogleAuth ? "Google Auth IP Mismatch" : "IP Address Mismatch");
            
            toast.error(`Access denied: Your IP address has changed. A verification email has been sent to confirm your identity. Location detected: ${locationData.city}, ${locationData.country}`);
            return null;
          } else {
            console.log('IP addresses match - access granted');
          }
        } else {
          console.log('No stored IP address for this user - skipping IP validation');
        }
        
        // Set ndaSigned based on investor status
        const isQualifiedOrSecured = investor.status === "Qualified Investor" || investor.status === "Secured Investor";
        
        // Return user data
        const userData: User = {
          id: investor.id,
          name: investor.name,
          email: investor.email,
          status: investor.status,
          phone: investor.phone,
          mobile: investor.mobile,
          mailingstreet: investor.mailingstreet,
          ipaddress: investor.ipaddress,
          ndaSigned: isQualifiedOrSecured // Set ndaSigned based on investor status
        };
        
        // Track the successful login
        await trackLogin(investor.id, isGoogleAuth ? "Google Auth Login" : "Login");
        
        return userData;
      } else {
        toast.error('Invalid password. Please try again.');
        return null;
      }
    } else {
      toast.error('Email not found. Please check your credentials.');
      return null;
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error('An error occurred during login. Please try again.');
    return null;
  }
};
