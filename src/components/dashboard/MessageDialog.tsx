
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail?: string;
  recipientName?: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ 
  open, 
  onOpenChange,
  recipientEmail = "sarah.mitchell@worldmotoclash.com",
  recipientName = "Sarah Mitchell"
}) => {
  const { user } = useUser();
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleReset = () => {
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  const submitInvestorTask = (contactId: string, subject: string, message: string) => {
    // Create a hidden iframe to avoid CORS issues
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create a URL with the query parameters
    const encodedSubject = encodeURIComponent(subject || 'Investor Question');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php?ContactId=${contactId}&Question=${encodedSubject}&relatedtoId=0015e000006AFg7&Comments=${encodedMessage}`;

    // Set iframe source to the URL
    if (iframe.contentWindow) {
      iframe.contentWindow.location.href = url;
    }

    // Remove iframe after a delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the member ID from the user context
      const memberId = user?.id || '0035e000003cugh'; // Default to the ID from XML if user not available
      
      // Submit the investor task
      submitInvestorTask(memberId, subject, message);
      
      toast.success(`Message sent to ${recipientName}`, {
        description: "They will get back to you shortly.",
      });
      
      // Close dialog after submission
      onOpenChange(false);
      handleReset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Send a Message</DialogTitle>
          <DialogDescription>
            Send a direct message to {recipientName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="from-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                From
              </label>
              <Input
                id="from-name"
                value={user?.name || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="from-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <Input
                id="from-email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="to" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <Input
              id="to"
              value={recipientEmail}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="border-gray-200 dark:border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[150px] border-gray-200 dark:border-gray-700"
              required
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !message.trim()}
              className="bg-black text-white hover:bg-black/80"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
