
import { User } from '@/contexts/UserContext';
import { toast } from 'sonner';

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
      mailingstreet: member.getElementsByTagName('mailingstreet')[0]?.textContent || ''
    }));
  } else {
    // Assume JSON response
    return await response.json();
  }
};

// Track login activity using an iframe to bypass CORS restrictions
export const trackLogin = async (contactId: string) => {
  try {
    console.log('Tracking login for contact ID:', contactId);
    
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
      
      // Add form fields
      const fields = {
        'sObj': 'ri__Portal__c',
        'string_ri__Contact__c': contactId,
        'text_ri__Login_URL__c': 'https://invest.worldmotoclash.com',
        'text_ri__Action__c': 'Login'
      };
      
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
      console.log('Submitting login tracking form via iframe');
      form.submit();
      
      // Remove iframe after some time to allow the request to complete
      setTimeout(() => {
        document.body.removeChild(trackingIframe);
        console.log('Login tracking iframe removed');
      }, 5000);
    } else {
      console.error('Could not access iframe document');
    }
  } catch (error) {
    // We don't want to disrupt the user experience if tracking fails
    console.error('Login tracking error:', error);
    console.log('Attempted to track login, but encountered an error');
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
        // Return user data
        const userData: User = {
          id: investor.id,
          name: investor.name,
          email: investor.email,
          status: investor.status,
          phone: investor.phone,
          mobile: investor.mobile,
          mailingstreet: investor.mailingstreet
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
