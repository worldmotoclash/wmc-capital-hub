
import React, { useState } from "react";
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
import { toast } from "sonner";

interface InvestDialogProps {
  trigger: React.ReactNode;
  defaultTier?: string;
}

const SFDC_ENDPOINT =
  "https://realintelligence.com/customers/expos/00D5e000000HEcP/submit-investor-task.php";
const HARDCODED_CONTACT_ID = "0035e000003cugh";
const RELATED_TO_ID = "0015e000006AFg7";

export const InvestDialog: React.FC<InvestDialogProps> = ({
  trigger,
  defaultTier,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Optional: Allow users to enter their name or email
  const [name, setName] = useState("");

  // Prefill subject with tier, or fallback
  const subject = defaultTier ? `Investor Inquiry: ${defaultTier}` : "Investor Inquiry";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your message.");
      return;
    }

    setSubmitting(true);
    try {
      // POST request parameters (form-urlencoded)
      const formData = new FormData();
      formData.append("ContactId", HARDCODED_CONTACT_ID);
      formData.append("Question", subject + (name ? ` [From: ${name}]` : ""));
      formData.append("relatedtoId", RELATED_TO_ID);
      formData.append("Comments", message);

      const res = await fetch(SFDC_ENDPOINT, {
        method: "POST",
        body: formData,
        mode: "no-cors", // SFDC endpoint probably doesn't return CORS headers
      });

      setMessage("");
      setName("");
      setOpen(false);
      toast.success("Your interest has been submitted! We'll reach out soon.");
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Invest in {defaultTier || "World Moto Clash"}
            </DialogTitle>
            <DialogDescription>
              Submit your interest and our team will connect with you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-3">
            <Input
              type="text"
              placeholder="Your Name or Email (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
            <Textarea
              required
              placeholder="Write a bit about your interest, or any questions you have"
              minLength={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-red-600 text-white hover:bg-red-700" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestDialog;
