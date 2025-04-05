import { User } from '@/contexts/UserContext';
import { toast } from 'sonner';

// Cache duration in milliseconds (24 hours)
const IP_CACHE_DURATION = 24 * 60 * 60 * 1000;

// Function to get the user's current IP address
export const getCurrentIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return '';
  }
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
export const trackLogin = async (contactId: string, action: string = 'Login') => {
  try {
    console.log(`Tracking ${action} for contact ID:`, contactId);
    
    // Get the current IP address
    const currentIp = await getCurrentIpAddress();
    console.log(`Current IP address for tracking: ${currentIp}`);
    
    // Get location data
    const locationData = await getIPLocation(currentIp);
    console.log(`Location data: Country - ${locationData.country}, City - ${locationData.city}`);
    
    // Create a hidden iframe element
    const trackingIframe = document.createElement('iframe');
    trackingIframe.style.display = 'none';
    document.body.appendChild(trackingIframe);
    
    // Create a form inside the iframe
    const trackingEndpoint = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php";
    
    // Wait for iframe to load
    await new Promise(resolve => {
      trackingIframe.onload = resolve;
      trackingIframe.src = 'about:blank';
    });
    
    // Get the iframe document
    const iframeDoc = trackingIframe.contentDocument || trackingIframe.contentWindow?.document;
    
    if (iframeDoc) {
      // Create a form in the iframe
      const form = iframeDoc.createElement('form');
      form.method = 'POST';
      form.action = trackingEndpoint;
      
      // Add form fields with updated field names
      const fields = {
        'sObj': 'ri__Portal__c',
        'string_ri__Contact__c': contactId,
        'text_ri__Login_URL__c': 'https://invest.worldmotoclash.com',
        'text_ri__Action__c': action,
        'text_ri__IP_Address__c': currentIp, // Updated field name
        'text_ri__Login_Country__c': locationData.country, // New field for country
        'text_ri__Login_City__c': locationData.city // New field for city
      };
      
      // Add each field to the form
      Object.entries(fields).forEach(([name, value]) => {
        const input = iframeDoc.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value as string;
        form.appendChild(input);
      });
      
      // Add form to iframe document and submit it
      iframeDoc.body.appendChild(form);
      console.log(`Submitting ${action} tracking form via iframe with IP: ${currentIp}, Country: ${locationData.country}, City: ${locationData.city}`);
      form.submit();
      
      // Remove iframe after some time to allow the request to complete
      setTimeout(() => {
        document.body.removeChild(trackingIframe);
        console.log(`${action} tracking iframe removed`);
      }, 5000);
    } else {
      console.error('Could not access iframe document');
    }
  } catch (error) {
    // We don't want to disrupt the user experience if tracking fails
    console.error('Tracking error:', error);
    console.log(`Attempted to track ${action}, but encountered an error`);
  }
};

// Authenticate user
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const data = await fetchInvestorData();
    
    console.log('Parsed investor data:', data);
    
    // Find the investor by email (case-insensitive comparison)
    const investor = data.find((inv: any) => 
      inv.email && inv.email.toLowerCase() === email.toLowerCase()
    );
    
    console.log('Found investor:', investor);
    
    if (investor) {
      console.log(`Password comparison: '${password}' vs '${investor.ripassword}'`);
      
      // Check if password matches
      if (investor.ripassword && password === investor.ripassword.toString()) {
        // If the investor has an IP address set, validate it
        if (investor.ipaddress && investor.ipaddress.trim() !== '') {
          console.log(`IP validation required. Stored IP: ${investor.ipaddress}`);
          
          // Get the user's current IP address
          const currentIp = await getCurrentIpAddress();
          console.log(`User's current IP: ${currentIp}`);
          
          // If IPs don't match, send verification email and deny access
          if (currentIp && currentIp !== investor.ipaddress) {
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
            await trackLogin(investor.id, "IP Address Mismatch");
            
            toast.error(`Access denied: Your IP address has changed. A verification email has been sent to confirm your identity. Location detected: ${locationData.city}, ${locationData.country}`);
            return null;
          }
        }
        
        // Return user data
        const userData: User = {
          id: investor.id,
          name: investor.name,
          email: investor.email,
          status: investor.status,
          phone: investor.phone,
          mobile: investor.mobile,
          mailingstreet: investor.mailingstreet,
          ipaddress: investor.ipaddress
        };
        
        // Track the successful login
        await trackLogin(investor.id);
        
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
