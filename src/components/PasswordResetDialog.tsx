
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleReset = () => {
    setEmail('');
    setIsLoading(false);
    setIsSuccess(false);
    setErrorMessage('');
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Fetch investor data from the provided API to find the contact ID
      const apiUrl = `https://api.realintelligence.com/api/specific-investor-list.py?orgId=00D5e000000HEcP&campaignId=7014V000002lcY2&sandbox=False`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch investor data');
      }
      
      const contentType = response.headers.get('content-type');
      let data;
      
      // Parse the response based on content type
      if (contentType?.includes('xml')) {
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const memberElements = xmlDoc.getElementsByTagName('member');
        
        data = Array.from(memberElements).map(member => ({
          id: member.getElementsByTagName('id')[0]?.textContent || '',
          email: member.getElementsByTagName('email')[0]?.textContent || '',
        }));
      } else {
        data = await response.json();
      }

      // Find the investor by email
      const investor = data.find((inv: any) => 
        inv.email && inv.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!investor) {
        setErrorMessage('Email not found. Please check your email address.');
        setIsLoading(false);
        return;
      }

      console.log('Found investor for password reset:', investor.id);
      
      // Create FormData object for the password reset request
      const formData = new FormData();
      formData.append('contactId', investor.id);
      formData.append('text_Reset_Password__c', 'Yes');
      formData.append('sObj', 'Contact');
      
      console.log('Sending reset request for contact ID:', investor.id);
      
      // Make the API call to request password reset using the correct endpoint
      const updateUrl = 'https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/update-engine-contact.php';
      
      const updateResponse = await fetch(updateUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Remove Content-Type header to let the browser set it properly with boundary for FormData
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const responseText = await updateResponse.text();
      console.log('Password reset response:', responseText);
      
      // Check if the response indicates success by checking for error keywords
      if (responseText.includes('ERROR') || responseText.includes('Error') || !updateResponse.ok) {
        console.error('Password reset request failed with response:', responseText);
        throw new Error('Failed to send password reset request. Please try again later.');
      }
      
      setIsSuccess(true);
      toast.success(
        'Password reset instructions have been sent to your email.',
        { duration: 5000 }
      );
      
      // Close dialog after showing success message
      setTimeout(() => {
        onOpenChange(false);
        handleReset();
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMsg = 'An error occurred while processing your request.';
      
      if (error instanceof Error) {
        errorMsg = error.message;
        console.error('Error details:', error.message);
      }
      
      setErrorMessage(errorMsg);
      toast.error('Password reset request failed.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address below and we'll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess ? (
            <Alert>
              <AlertDescription className="text-green-600 font-medium">
                Password reset request sent. Please check your email for instructions.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Processing...' : 'Send Reset Link'}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
