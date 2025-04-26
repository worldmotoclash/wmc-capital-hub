
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface InvestDialogProps {
  trigger: React.ReactNode;
  defaultTier?: string;
}

// Salesforce Web-to-Lead endpoint & org info
const SF_WEBTOLEAD = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
const SF_ORG_ID = "00D5e000000HEcP";

const InvestDialog: React.FC<InvestDialogProps> = ({
  trigger,
  defaultTier,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();

  // Split full name if possible
  let firstName = "";
  let lastName = "";
  if (user?.name) {
    const parts = user.name.trim().split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // Auto-filled email from user context
  const email = user?.email || "";
  const selectedTier = defaultTier || "";

  const handleIframeLoad = () => {
    // This triggers after form submission completes
    if (isSubmitting) {
      setIsSubmitting(false);
      setOpen(false);
      setMessage("");
      
      toast.success(
        "Investment Interest Received!", 
        {
          description: "Thank you for your interest. Our team will contact you shortly.",
          icon: <Check className="h-4 w-4" />,
          duration: 5000,
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    formRef.current?.submit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invest in {selectedTier ? selectedTier : "World Moto Clash"}
          </DialogTitle>
          <DialogDescription>
            Submit your interest. Our team will connect with you soon.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={SF_WEBTOLEAD}
          method="POST"
          target="hidden_iframe"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Hidden iframe for form submission */}
          <iframe 
            name="hidden_iframe"
            id="hidden_iframe"
            ref={iframeRef}
            onLoad={handleIframeLoad}
            style={{ display: 'none' }}
            title="Hidden Form Frame"
          />

          {/* Required org field */}
          <input type="hidden" name="oid" value={SF_ORG_ID} />

          {/* Investor Tier as custom field */}
          <input
            type="hidden"
            name="00N5e00000gt2r6"
            value={selectedTier}
          />

          {/* Hidden user information fields */}
          <input type="hidden" name="first_name" value={firstName} />
          <input type="hidden" name="last_name" value={lastName} />
          <input type="hidden" name="email" value={email} />

          {/* Optional message field */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Additional Message (Optional)
            </label>
            <Textarea
              id="message"
              name="description"
              placeholder="Write any questions or additional information you'd like to share"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestDialog;
