
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
import { useUser } from "@/contexts/UserContext";

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
  const [showThankYou, setShowThankYou] = useState(false);
  const { user } = useUser();

  // Use the logged-in user's name, fallback to "Investor"
  const userName = user?.name || "Investor";
  const userEmail = user?.email || "";
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
      // Include user name and email in the question string
      let questionStr = subject;
      if (userName || userEmail) {
        questionStr += ` [From: ${userName}${userEmail ? " - " + userEmail : ""}]`;
      }
      formData.append("Question", questionStr);
      formData.append("relatedtoId", RELATED_TO_ID);
      formData.append("Comments", message);

      await fetch(SFDC_ENDPOINT, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setShowThankYou(true);
      // Clear input state for next open
      setMessage("");

      // Show the thank you response for 3 seconds, then close
      setTimeout(() => {
        setShowThankYou(false);
        setOpen(false);
      }, 3000);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setShowThankYou(false); }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        {!showThankYou ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                Invest in {defaultTier || "World Moto Clash"}
              </DialogTitle>
              <DialogDescription>
                Submit your interest and our team will connect with you soon.
              </DialogDescription>
            </DialogHeader>
            {/* Greet the user instead of prompting their email */}
            <div className="my-4 space-y-3">
              <div className="text-base text-gray-700 dark:text-gray-200">
                {user ? (
                  <>
                    Hi <span className="font-semibold">{userName}</span>
                    <span className="ml-1 text-xs font-mono text-gray-500">{userEmail}</span>
                  </>
                ) : (
                  <>Hi, Investor!</>
                )}
              </div>
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
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center py-8">
            <div className="text-2xl font-semibold text-green-600 mb-2 text-center">
              Thank you {userName} for your interest in {defaultTier || "World Moto Clash"}!
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-center">
              Our team will reach out soon to your email: <span className="font-mono font-semibold">{userEmail}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestDialog;
