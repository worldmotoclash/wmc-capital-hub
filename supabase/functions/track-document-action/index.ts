import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackingRequest {
  contactId: string;
  documentUrl: string;
  actionType: string;
  documentTitle?: string;
}

interface IPInfo {
  ip: string;
  country: string;
  city: string;
}

async function getCurrentIpAddress(): Promise<string> {
  const services = [
    'https://api.ipify.org?format=json',
    'https://ipapi.co/json/',
    'https://ipinfo.io/json'
  ];

  for (const service of services) {
    try {
      const response = await fetch(service);
      const data = await response.json();
      const ip = data.ip || data.query;
      if (ip && ip !== '127.0.0.1' && ip !== 'localhost') {
        return ip;
      }
    } catch (error) {
      console.log(`Service ${service} failed:`, error);
    }
  }
  
  return '0.0.0.0'; // Fallback
}

async function getIPLocation(ip: string): Promise<{ country: string; city: string }> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown'
      };
    }
  } catch (error) {
    console.log('IP location lookup failed:', error);
  }
  
  return { country: 'Unknown', city: 'Unknown' };
}

async function submitToTrackingEngine(contactId: string, documentUrl: string, actionType: string, documentTitle: string, ipInfo: IPInfo) {
  const formData = new FormData();
  formData.append('sObj', 'ri__Portal__c');
  formData.append('string_ri__Contact__c', contactId);
  formData.append('text_ri__Login_URL__c', documentUrl);
  formData.append('text_ri__Action__c', actionType);
  formData.append('text_ri__IP_Address__c', ipInfo.ip);
  formData.append('text_ri__Login_Country__c', ipInfo.country);
  formData.append('text_ri__Login_City__c', ipInfo.city);
  
  // Add document title if provided
  if (documentTitle && documentTitle !== 'Unknown Document') {
    formData.append('text_Document_Title__c', documentTitle);
  }

  const response = await fetch('https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php', {
    method: 'POST',
    body: formData,
  });

  return response.ok;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactId, documentUrl, actionType, documentTitle }: TrackingRequest = await req.json();

    console.log('Tracking request received:', { contactId, documentUrl, actionType, documentTitle });

    // Get IP address and location server-side
    const ip = await getCurrentIpAddress();
    const location = await getIPLocation(ip);
    
    const ipInfo: IPInfo = {
      ip,
      country: location.country,
      city: location.city
    };

    console.log('IP Info:', ipInfo);

    // Submit to tracking engine
    const success = await submitToTrackingEngine(
      contactId, 
      documentUrl, 
      actionType, 
      documentTitle || '',
      ipInfo
    );

    // Return form data for debugging (client can open in new window)
    const formData = {
      'sObj': 'ri__Portal__c',
      'string_ri__Contact__c': contactId,
      'text_ri__Login_URL__c': documentUrl,
      'text_ri__Action__c': actionType,
      'text_ri__Document_Title__c': documentTitle || '',
      'text_ri__IP_Address__c': ipInfo.ip,
      'text_ri__Login_Country__c': ipInfo.country,
      'text_ri__Login_City__c': ipInfo.city,
    };

    if (success) {
      console.log('Successfully tracked document action');
      return new Response(JSON.stringify({ 
        success: true, 
        formData,
        targetUrl: 'https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Failed to submit to tracking engine');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Tracking engine submission failed',
        formData,
        targetUrl: 'https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in track-document-action function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});