
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    
    if (!resetEmail) {
      setResetError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Email is invalid');
      return;
    }
    
    setIsResetting(true);
    
    try {
      // Fetch investor data to find the contact ID
      const apiUrl = `https://api.realintelligence.com/api/specific-investor-list.py?orgId=00D5e000000HEcP&campaignId=7014V000002lcY2&sandbox=False`;
      
      console.log('Fetching investor data from:', apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error('Failed to fetch investor data with status:', response.status);
        throw new Error('Failed to fetch investor data');
      }
      
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('xml')) {
        // Parse XML response
        const text = await response.text();
        console.log('Received XML response:', text.substring(0, 200) + '...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const memberElements = xmlDoc.getElementsByTagName('member');
        
        data = Array.from(memberElements).map(member => ({
          id: member.getElementsByTagName('id')[0]?.textContent || '',
          email: member.getElementsByTagName('email')[0]?.textContent || '',
        }));
      } else {
        // Assume JSON response
        data = await response.json();
      }
      
      // Find the investor by email (case-insensitive comparison)
      const investor = data.find((inv: any) => 
        inv.email && inv.email.toLowerCase() === resetEmail.toLowerCase()
      );
      
      if (!investor) {
        setResetError('Email not found. Please check your email address.');
        return;
      }
      
      console.log('Found investor for password reset:', investor.id);
      
      // Create the update data
      const updateData = {
        contactId: investor.id,
        text_Reset_Password__c: "Yes",
        sObj: "Contact"
      };
      
      console.log('Sending reset request with data:', updateData);
      
      // Try as JSON
      const updateResponse = await fetch('https://api.realintelligence.com/api/update-investor.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        mode: 'cors',
      }).catch(error => {
        console.error('JSON request failed with error:', error);
        return null;
      });
      
      if (updateResponse && updateResponse.ok) {
        toast.success('Password reset email sent. Please check your inbox.');
        onOpenChange(false);
        setResetEmail('');
        return;
      }
      
      if (updateResponse) {
        console.error('Reset request failed with status:', updateResponse.status);
        const errorText = await updateResponse.text();
        console.error('Error response:', errorText);
      }
      
      // If JSON approach failed, try URLEncoded approach
      console.log('Trying URL encoded form data approach...');
      const formData = new URLSearchParams();
      formData.append('contactId', investor.id);
      formData.append('text_Reset_Password__c', 'Yes');
      formData.append('sObj', 'Contact');
      
      const formResponse = await fetch('https://api.realintelligence.com/api/update-investor.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        mode: 'cors',
      }).catch(error => {
        console.error('Form request failed with error:', error);
        return null;
      });
      
      if (formResponse && formResponse.ok) {
        toast.success('Password reset email sent. Please check your inbox.');
        onOpenChange(false);
        setResetEmail('');
      } else {
        if (formResponse) {
          console.error('Form reset request failed with status:', formResponse.status);
          const errorText = await formResponse.text();
          console.error('Form error response:', errorText);
        }
        throw new Error('Failed to request password reset. The server might be unavailable.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setResetError('An error occurred. Please try again later.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address below. We'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleForgotPassword} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input 
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="name@company.com"
            />
            {resetError && (
              <p className="text-sm text-red-500 mt-1">{resetError}</p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isResetting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isResetting}>
              {isResetting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
