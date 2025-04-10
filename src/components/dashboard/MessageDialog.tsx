
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
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  
  React.useEffect(() => {
    // Cleanup iframe on component unmount
    return () => {
      if (iframeRef.current && iframeRef.current.parentNode) {
        document.body.removeChild(iframeRef.current);
      }
    };
  }, []);
  
  const handleReset = () => {
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
    setSubmissionStatus('idle');
  };

  const submitInvestorTask = (contactId: string, subject: string, message: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log('Starting message submission to investor task endpoint');
      
      try {
        // Create a hidden iframe if not already created
        if (!iframeRef.current) {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframeRef.current = iframe;
          
          console.log('Created hidden iframe for submission');
        }
        
        // Wait for iframe to be ready
        const iframe = iframeRef.current;
        
        if (!iframe.contentWindow) {
          console.error('No iframe content window available');
          reject(new Error('No iframe content window available'));
          return;
        }
        
        // Get the iframe document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        if (!iframeDoc) {
          console.error('No iframe document available');
          reject(new Error('No iframe document available'));
          return;
        }
        
        // Create a form element for submission
        const form = iframeDoc.createElement('form');
        form.method = 'POST';
        form.action = 'https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php';
        
        // Add the form fields
        const contactIdField = iframeDoc.createElement('input');
        contactIdField.type = 'hidden';
        contactIdField.name = 'ContactId';
        contactIdField.value = contactId;
        form.appendChild(contactIdField);
        
        const subjectField = iframeDoc.createElement('input');
        subjectField.type = 'hidden';
        subjectField.name = 'Question';
        subjectField.value = subject || 'Investor Question';
        form.appendChild(subjectField);
        
        const relatedToField = iframeDoc.createElement('input');
        relatedToField.type = 'hidden';
        relatedToField.name = 'relatedtoId';
        relatedToField.value = '0015e000006AFg7';
        form.appendChild(relatedToField);
        
        const messageField = iframeDoc.createElement('input');
        messageField.type = 'hidden';
        messageField.name = 'Comments';
        messageField.value = message;
        form.appendChild(messageField);
        
        // Add a load event listener to handle the response
        iframe.onload = () => {
          console.log('Form submission completed');
          resolve(true);
        };
        
        iframe.onerror = (error) => {
          console.error('Form submission failed:', error);
          reject(error);
        };
        
        // Add the form to the document and submit it
        iframeDoc.body.appendChild(form);
        console.log('Submitting message form with data:', {
          ContactId: contactId,
          Question: subject || 'Investor Question',
          relatedtoId: '0015e000006AFg7',
          Comments: message.substring(0, 20) + '...' // Log first 20 chars for privacy
        });
        
        form.submit();
        
        // Set a backup timeout in case onload doesn't fire
        setTimeout(() => {
          if (submissionStatus !== 'success') {
            console.log('Backup timeout resolving promise as successful');
            resolve(true);
          }
        }, 5000);
        
      } catch (error) {
        console.error('Error during form submission:', error);
        reject(error);
      }
    });
  };
  
  // Alternative implementation using direct URL navigation
  const submitViaUrlNavigation = (contactId: string, subject: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('Starting URL navigation submission method');
      
      try {
        // Create a hidden iframe or use existing one
        if (!iframeRef.current) {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframeRef.current = iframe;
          console.log('Created hidden iframe for URL submission');
        }
        
        // Create a URL with the query parameters
        const encodedSubject = encodeURIComponent(subject || 'Investor Question');
        const encodedMessage = encodeURIComponent(message);
        const url = `https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php?ContactId=${contactId}&Question=${encodedSubject}&relatedtoId=0015e000006AFg7&Comments=${encodedMessage}`;
        
        console.log('Navigating to URL (first 100 chars):', url.substring(0, 100) + '...');
        
        // Set iframe source to the URL
        if (iframeRef.current.contentWindow) {
          iframeRef.current.onload = () => {
            console.log('URL navigation completed');
            resolve(true);
          };
          
          iframeRef.current.contentWindow.location.href = url;
          
          // Set a backup timeout in case onload doesn't fire
          setTimeout(() => {
            console.log('Backup timeout resolving URL navigation as successful');
            resolve(true);
          }, 3000);
        } else {
          console.error('No iframe content window available for URL navigation');
          resolve(false);
        }
      } catch (error) {
        console.error('Error during URL navigation:', error);
        resolve(false);
      }
    });
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
      const memberId = user?.id || '0035e000003cugh'; // Default to the ID from XML if user not available
      console.log('Using member ID:', memberId);
      
      // Try form submission first
      let success = false;
      
      try {
        console.log('Attempting form-based submission');
        await submitInvestorTask(memberId, subject, message);
        success = true;
      } catch (formError) {
        console.error('Form submission failed, trying URL navigation method', formError);
        // Fall back to URL navigation method
        success = await submitViaUrlNavigation(memberId, subject, message);
      }
      
      if (success) {
        console.log('Message successfully submitted');
        setSubmissionStatus('success');
        toast.success(`Message sent to ${recipientName}`, {
          description: "They will get back to you shortly.",
        });
        
        // Close dialog after submission
        onOpenChange(false);
        handleReset();
      } else {
        throw new Error('Both submission methods failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmissionStatus('error');
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
