
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentIpAddress, getIPLocation } from '@/services/loginService';

const TestLoginTracking: React.FC = () => {
  const [formData, setFormData] = useState({
    contactId: '0035e000003cugh',
    action: 'Login',
    loginUrl: 'https://invest.worldmotoclash.com'
  });

  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse('');
    setLogs([]);

    try {
      addLog(`[TEST LOGIN] Starting login tracking test...`);
      addLog(`[TEST LOGIN] Contact ID: ${formData.contactId}`);
      addLog(`[TEST LOGIN] Action: ${formData.action}`);
      addLog(`[TEST LOGIN] Login URL: ${formData.loginUrl}`);
      
      // Pre-fetch IP and location data (exactly like the working code)
      addLog(`[TEST LOGIN] Step 1: Fetching IP and location data...`);
      const currentIp = await getCurrentIpAddress();
      const locationData = await getIPLocation(currentIp);
      
      addLog(`[TEST LOGIN] IP data fetched: ${currentIp}, Location: ${locationData.city}, ${locationData.country}`);
      
      // Create iframe for tracking (exactly like the working trackLogin function)
      const trackingIframe = document.createElement('iframe');
      trackingIframe.style.display = 'none';
      
      trackingIframe.onload = () => {
        try {
          addLog(`[TEST LOGIN] Iframe loaded, creating form...`);
          
          const iframeDoc = trackingIframe.contentDocument || trackingIframe.contentWindow?.document;
          if (!iframeDoc) {
            addLog(`[TEST LOGIN] ERROR: Could not access iframe document`);
            setResponse('Error: Could not access iframe document');
            return;
          }

          const form = iframeDoc.createElement('form');
          form.method = 'POST';
          form.action = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php";
            
          const fields: Record<string, string> = {
            'sObj': 'ri__Portal__c',
            'string_ri__Contact__c': formData.contactId,
            'text_ri__Login_URL__c': formData.loginUrl,
            'text_ri__Action__c': formData.action,
            'text_ri__IP_Address__c': currentIp,
            'text_ri__Login_Country__c': locationData.country,
            'text_ri__Login_City__c': locationData.city,
          };

          addLog(`[TEST LOGIN] Creating form fields...`);
          Object.entries(fields).forEach(([name, value]) => {
            const input = iframeDoc.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
            addLog(`[TEST LOGIN] Added field: ${name} = ${value}`);
          });

          iframeDoc.body.appendChild(form);
          addLog(`[TEST LOGIN] Submitting form for: ${formData.action}`);
          form.submit();
          
          setResponse(`Login tracking request submitted successfully for action: ${formData.action}`);
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown iframe error';
          addLog(`[TEST LOGIN] Error during form creation/submission: ${errorMessage}`);
          setResponse(`Error: ${errorMessage}`);
        }
      };
      
      document.body.appendChild(trackingIframe);
      trackingIframe.src = 'about:blank';
      
      addLog(`[TEST LOGIN] Iframe created and added to document`);
      
      // Remove iframe after sufficient time for request to complete (same as working code)
      setTimeout(() => {
        if (document.body.contains(trackingIframe)) {
          document.body.removeChild(trackingIframe);
          addLog(`[TEST LOGIN] Request completed and iframe removed for: ${formData.action}`);
        }
        setIsSubmitting(false);
      }, 5000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[TEST LOGIN] Error: ${errorMessage}`);
      setResponse(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const testDirectFetch = async () => {
    setIsSubmitting(true);
    setResponse('');
    setLogs([]);

    try {
      addLog('Testing direct fetch approach...');
      
      const currentIp = await getCurrentIpAddress();
      const locationData = await getIPLocation(currentIp);
      
      const form = new FormData();
      const fields = {
        'sObj': 'ri__Portal__c',
        'string_ri__Contact__c': formData.contactId,
        'text_ri__Login_URL__c': formData.loginUrl,
        'text_ri__Action__c': formData.action,
        'text_ri__IP_Address__c': currentIp,
        'text_ri__Login_Country__c': locationData.country,
        'text_ri__Login_City__c': locationData.city,
      };

      Object.entries(fields).forEach(([key, value]) => {
        form.append(key, value);
        addLog(`Added form field: ${key} = ${value}`);
      });

      const result = await fetch('https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php', {
        method: 'POST',
        body: form,
        mode: 'no-cors'
      });

      addLog(`Response received. Status: ${result.status || 'Unknown (no-cors mode)'}`);
      addLog(`Response type: ${result.type}`);
      
      setResponse(`Direct fetch completed. Status: ${result.status || 'Unknown'}, Type: ${result.type}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Direct fetch error: ${errorMessage}`);
      setResponse(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login Tracking Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Login Tracking Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginTracking} className="space-y-4">
                <div>
                  <Label htmlFor="contactId">Contact ID</Label>
                  <Input
                    id="contactId"
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Input
                    id="action"
                    name="action"
                    value={formData.action}
                    onChange={handleInputChange}
                    placeholder="Login, Logout, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="loginUrl">Login URL</Label>
                  <Input
                    id="loginUrl"
                    name="loginUrl"
                    value={formData.loginUrl}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Testing...' : 'Test Login Tracking (Iframe)'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={testDirectFetch}
                    disabled={isSubmitting}
                  >
                    Test Direct Fetch
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Endpoint Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">URL:</Label>
                    <p className="text-sm break-all bg-gray-100 p-2 rounded font-mono">
                      https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php
                    </p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Method:</Label>
                    <p className="text-sm">POST</p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Object:</Label>
                    <p className="text-sm">ri__Portal__c</p>
                  </div>
                  
                  {response && (
                    <div>
                      <Label className="font-semibold">Response:</Label>
                      <p className="text-sm bg-gray-100 p-2 rounded mt-1">{response}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {logs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Debug Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-64 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comparison Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>This uses the EXACT same code</strong> as the working trackLogin function</li>
              <li><strong>Same endpoint:</strong> w2x-engine.php</li>
              <li><strong>Same object:</strong> ri__Portal__c</li>
              <li><strong>Same approach:</strong> iframe with form submission</li>
              <li><strong>Same timing:</strong> 5 second cleanup delay</li>
              <li><strong>Check Network Tab:</strong> Compare this request with the video tracking request</li>
              <li><strong>Key difference to check:</strong> Are the field names and values exactly the same?</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestLoginTracking;
