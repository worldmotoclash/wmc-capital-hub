
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
      
      // Create the password reset request data
      const resetData = {
        contactId: investor.id,
        text_Reset_Password__c: "Yes",
        sObj: "Contact"
      };
      
      console.log('Sending reset request with data:', resetData);
      
      // Make the actual API call to update the password reset flag
      const updateUrl = `https://api.realintelligence.com/api/update-investor.php`;
      
      const updateResponse = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
        mode: 'cors'
      });
      
      if (!updateResponse.ok) {
        console.error('Password reset request failed with status:', updateResponse.status);
        const errorText = await updateResponse.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to send password reset request');
      }
      
      const updateResult = await updateResponse.text();
      console.log('Password reset response:', updateResult);
      
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
      setErrorMessage('An error occurred while processing your request. Please try again later or contact support.');
      toast.error('Password reset request failed. Please try again later.');
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
