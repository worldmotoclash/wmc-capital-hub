
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
import { useUser } from "@/contexts/UserContext";

interface InvestDialogProps {
  trigger: React.ReactNode;
  defaultTier?: string;
}

// Salesforce Web-to-Lead endpoint & org info
const SF_WEBTOLEAD = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
const SF_ORG_ID = "00D5e000000HEcP";
const SF_RETURL = "http://worldmotoclash.com/thankyou";

const InvestDialog: React.FC<InvestDialogProps> = ({
  trigger,
  defaultTier,
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  // These state hooks are for fields not auto-filled from user
  const [message, setMessage] = useState("");

  // We need to split full name if possible
  let firstName = "";
  let lastName = "";
  if (user?.name) {
    const parts = user.name.trim().split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // Fallback: email from user or blank
  const email = user?.email || "";

  // Invest tier records which tier (e.g. Pit Pass, Legend, etc.)
  const selectedTier = defaultTier || "";

  // Form submit relies on classic web form POST; no JS needed.
  // However, we use React here to close the dialog on open/close,
  // but the form itself will handle the redirect.
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
          action={SF_WEBTOLEAD}
          method="POST"
          className="space-y-6"
        >
          {/* Required org and redirect fields */}
          <input type="hidden" name="oid" value={SF_ORG_ID} />
          <input type="hidden" name="retURL" value={SF_RETURL} />

          {/* Investor Tier as custom field */}
          <input
            type="hidden"
            name="00N5e00000gt2r6"
            value={selectedTier}
            // Salesforce custom field (Investor Type) for Tier tracking
          />

          {/* Prefill/readonly if user is logged in, otherwise let user type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="first_name"
                name="first_name"
                maxLength={40}
                placeholder="First Name"
                required
                value={firstName}
                readOnly={!!firstName}
                autoFocus
                tabIndex={0}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="last_name"
                name="last_name"
                maxLength={80}
                placeholder="Last Name"
                required
                value={lastName}
                readOnly={!!lastName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              maxLength={80}
              placeholder="your@email.com"
              required
              value={email}
              readOnly={!!email}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea
              id="message"
              name="description"
              minLength={4}
              placeholder="Write a bit about your investment interest or any questions you have"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
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
              tabIndex={0}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestDialog;
