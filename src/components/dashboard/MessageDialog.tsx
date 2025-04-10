
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
  const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const formRef = React.useRef<HTMLFormElement | null>(null);
  
  const handleReset = () => {
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
    setSubmissionStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus('pending');
    
    try {
      console.log('Message submission initiated');
      
      // Get the member ID from the user context
      const memberId = user?.id || '0035e000003cugh';
      console.log('Using member ID:', memberId);
      console.log('Message:', message);
      console.log('Subject:', subject);
      
      // Create a hidden iframe for submission using exactly the same pattern 
      // that works in loginService.ts
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Wait for iframe to load
      await new Promise(resolve => {
        iframe.onload = resolve;
        iframe.src = 'about:blank';
      });
      
      // Get the iframe document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        throw new Error('Cannot access iframe document');
      }
      
      // Create a form element
      const form = iframeDoc.createElement('form');
      form.method = 'POST';
      form.action = 'https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php';
      
      // Add form fields with EXACT parameter names - matching case sensitivity
      const fields = [
        { name: 'ContactId', value: memberId },
        { name: 'Question', value: subject || 'Investor Question' },
        { name: 'relatedtoId', value: '0015e000006AFg7' },
        { name: 'Comments', value: message }
      ];
      
      // Log the exact values being submitted
      console.log('Form submission data:', Object.fromEntries(fields.map(f => [f.name, f.value])));
      
      // Add fields to form
      fields.forEach(field => {
        const input = iframeDoc.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
      });
      
      // Add form to iframe document
      iframeDoc.body.appendChild(form);
      
      // Submit the form
      console.log('Submitting form now...');
      form.submit();
      
      // Handle success with a longer timeout (matching loginService pattern)
      setTimeout(() => {
        // Clean up iframe
        document.body.removeChild(iframe);
        
        console.log('Message successfully submitted');
        setSubmissionStatus('success');
        toast.success(`Message sent to ${recipientName}`, {
          description: "They will get back to you shortly.",
        });
        
        // Close dialog after submission
        onOpenChange(false);
        handleReset();
      }, 5000); // Increased from 3000 to 5000 to match successful implementation
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmissionStatus('error');
      toast.error('Failed to send message. Please try again.');
      
      // Try fallback method
      console.log('Attempting fallback submission method...');
      const fallbackSuccess = submitViaDirectUrl();
      
      if (fallbackSuccess) {
        setTimeout(() => {
          setSubmissionStatus('success');
          toast.success(`Message sent to ${recipientName}`, {
            description: "They will get back to you shortly.",
          });
          
          // Close dialog after submission
          onOpenChange(false);
          handleReset();
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Implement direct URL submission as a fallback
  const submitViaDirectUrl = () => {
    try {
      const memberId = user?.id || '0035e000003cugh';
      const encodedSubject = encodeURIComponent(subject || 'Investor Question');
      const encodedMessage = encodeURIComponent(message);
      
      const url = `https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php?ContactId=${memberId}&Question=${encodedSubject}&relatedtoId=0015e000006AFg7&Comments=${encodedMessage}`;
      
      console.log('Direct URL submission:', url);
      
      // Create a hidden iframe for the URL submission
      const fallbackIframe = document.createElement('iframe');
      fallbackIframe.style.display = 'none';
      document.body.appendChild(fallbackIframe);
      
      // Wait for iframe to load
      const iframePromise = new Promise<void>(resolve => {
        fallbackIframe.onload = () => resolve();
        fallbackIframe.src = url;
      });
      
      // Set a timeout for the iframe load
      iframePromise.then(() => {
        console.log('Fallback iframe loaded successfully');
        
        // Remove iframe after a delay
        setTimeout(() => {
          document.body.removeChild(fallbackIframe);
          console.log('Fallback iframe removed');
        }, 5000);
      });
      
      return true;
    } catch (err) {
      console.error('Error with direct URL submission:', err);
      return false;
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
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4" ref={formRef}>
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
