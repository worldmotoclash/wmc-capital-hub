
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestTracking: React.FC = () => {
  const [formData, setFormData] = useState({
    sObj: 'ri__Portal__c',
    string_ri__Contact__c: '0035e000003cugh',
    text_ri__Login_URL__c: 'https://drive.google.com/file/d/1ZDIK7ACuHd8GRvIXtiVBabDx3D3Aski7/preview',
    text_ri__Action__c: 'Video View',
    text_ri__IP_Address__c: '47.208.228.21',
    text_ri__Login_Country__c: 'United States',
    text_ri__Login_City__c: 'Meadow Vista',
    text_ri__Document_Title__c: 'WMC Motorsports Reimagined!'
  });

  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse('');

    try {
      // Create form data
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      console.log('Submitting form data:', Object.fromEntries(form));

      // Submit to the endpoint
      const result = await fetch('https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php', {
        method: 'POST',
        body: form,
        mode: 'no-cors' // This might be needed due to CORS
      });

      console.log('Response:', result);
      setResponse(`Form submitted successfully. Status: ${result.status || 'Unknown (no-cors mode)'}`);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIframeSubmit = () => {
    setIsSubmitting(true);
    setResponse('');

    try {
      // Create iframe (same approach as the app)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            setResponse('Error: Could not access iframe document');
            setIsSubmitting(false);
            return;
          }

          const form = iframeDoc.createElement('form');
          form.method = 'POST';
          form.action = 'https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php';
          
          Object.entries(formData).forEach(([name, value]) => {
            const input = iframeDoc.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });

          iframeDoc.body.appendChild(form);
          console.log('Submitting via iframe with data:', formData);
          form.submit();
          
          setResponse('Form submitted via iframe successfully');
          
        } catch (err) {
          console.error('Iframe error:', err);
          setResponse(`Iframe error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      };
      
      document.body.appendChild(iframe);
      iframe.src = 'about:blank';
      
      // Remove iframe after 5 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        setIsSubmitting(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error creating iframe:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Video Tracking Endpoint Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Form Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="sObj">sObj</Label>
                  <Input
                    id="sObj"
                    name="sObj"
                    value={formData.sObj}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="string_ri__Contact__c">Contact ID</Label>
                  <Input
                    id="string_ri__Contact__c"
                    name="string_ri__Contact__c"
                    value={formData.string_ri__Contact__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__Login_URL__c">Video URL</Label>
                  <Textarea
                    id="text_ri__Login_URL__c"
                    name="text_ri__Login_URL__c"
                    value={formData.text_ri__Login_URL__c}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__Action__c">Action</Label>
                  <Input
                    id="text_ri__Action__c"
                    name="text_ri__Action__c"
                    value={formData.text_ri__Action__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__IP_Address__c">IP Address</Label>
                  <Input
                    id="text_ri__IP_Address__c"
                    name="text_ri__IP_Address__c"
                    value={formData.text_ri__IP_Address__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__Login_Country__c">Country</Label>
                  <Input
                    id="text_ri__Login_Country__c"
                    name="text_ri__Login_Country__c"
                    value={formData.text_ri__Login_Country__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__Login_City__c">City</Label>
                  <Input
                    id="text_ri__Login_City__c"
                    name="text_ri__Login_City__c"
                    value={formData.text_ri__Login_City__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_ri__Document_Title__c">Document Title</Label>
                  <Input
                    id="text_ri__Document_Title__c"
                    name="text_ri__Document_Title__c"
                    value={formData.text_ri__Document_Title__c}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Direct'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleIframeSubmit}
                    disabled={isSubmitting}
                  >
                    Submit via Iframe
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Endpoint URL:</Label>
                  <p className="text-sm break-all bg-gray-100 p-2 rounded">
                    https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php
                  </p>
                </div>
                
                <div>
                  <Label className="font-semibold">Method:</Label>
                  <p className="text-sm">POST</p>
                </div>
                
                <div>
                  <Label className="font-semibold">Content-Type:</Label>
                  <p className="text-sm">multipart/form-data</p>
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
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>The form above contains the exact parameters sent by the video tracking function</li>
              <li>"Submit Direct" attempts a direct fetch request (may fail due to CORS)</li>
              <li>"Submit via Iframe" uses the same iframe method as the app</li>
              <li>Check the browser console for detailed logs</li>
              <li>Modify the parameters above to test different scenarios</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestTracking;
