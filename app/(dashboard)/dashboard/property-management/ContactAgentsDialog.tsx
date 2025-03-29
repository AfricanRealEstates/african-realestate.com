"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendEmailToAgent } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Updated interface to match the Prisma schema with nullable fields
interface Property {
  id: string;
  title: string;
  isActive: boolean;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface ContactAgentDialogProps {
  property: Property;
  trigger: React.ReactNode;
}

export default function ContactAgentDialog({
  property,
  trigger,
}: ContactAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateType, setTemplateType] = useState("activation");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Get agent name with fallback
  const agentName = property.user.name || "Property Owner";
  const agentEmail = property.user.email;

  // Set default templates based on selection
  const updateTemplate = (type: string) => {
    setTemplateType(type);

    switch (type) {
      case "activation":
        setSubject(
          `Action Required: Activate Your Property Listing - ${property.title}`
        );
        setMessage(
          `Dear ${agentName},\n\n` +
            `We noticed that your property "${property.title}" is currently inactive on our platform. ` +
            `An inactive listing won't be visible to potential buyers or renters.\n\n` +
            `To maximize your property's exposure and increase your chances of finding the right buyer/tenant, ` +
            `we recommend activating your listing as soon as possible.\n\n` +
            `You can activate your property by logging into your dashboard and paying for property to give the status to "Active".\n\n` +
            `If you have any questions or need assistance with activating your listing, please don't hesitate to reply to this email.\n\n` +
            `Best regards,\n` +
            `The African Real Estate Team`
        );
        break;
      case "update":
        setSubject(
          `Update Request: Property Information for ${property.title}`
        );
        setMessage(
          `Dear ${agentName},\n\n` +
            `We're reaching out regarding your property listing "${property.title}" on African Real Estate.\n\n` +
            `We've noticed that some information might need updating to make your listing more attractive to potential buyers/renters. ` +
            `Complete and up-to-date listings typically receive more interest and inquiries.\n\n` +
            `Please consider updating the following aspects of your listing:\n` +
            `- Add more high-quality photos\n` +
            `- Complete all property details and specifications\n` +
            `- Update the property description with compelling information\n` +
            `- Verify that the price is current and competitive\n\n` +
            `You can make these updates by logging into your dashboard and editing your property listing.\n\n` +
            `If you need any assistance, please don't hesitate to contact us.\n\n` +
            `Best regards,\n` +
            `The African Real Estate Team`
        );
        break;
      case "feedback":
        setSubject(`We Value Your Feedback on African Real Estate`);
        setMessage(
          `Dear ${agentName},\n\n` +
            `Thank you for listing your property "${property.title}" on African Real Estate.\n\n` +
            `We're constantly working to improve our platform and services for property owners like you. ` +
            `Your feedback is invaluable in helping us enhance the experience for all our users.\n\n` +
            `We would greatly appreciate if you could take a few minutes to share your thoughts on:\n` +
            `- Your overall experience using our platform\n` +
            `- The listing process and property management tools\n` +
            `- Any features you'd like to see added or improved\n` +
            `- Any challenges you've encountered\n\n` +
            `Please feel free to reply directly to this email with your feedback or suggestions.\n\n` +
            `Thank you for being part of African Real Estate.\n\n` +
            `Best regards,\n` +
            `The African Real Estate Team`
        );
        break;
      case "custom":
        setSubject(`Regarding Your Property: ${property.title}`);
        setMessage(
          `Dear ${agentName},\n\n[Your custom message here]\n\nBest regards,\nThe African Real Estate Team`
        );
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if agent email is available
    if (!agentEmail) {
      toast({
        title: "Error",
        description: "Agent email is not available. Cannot send email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await sendEmailToAgent({
        propertyId: property.id,
        agentEmail: agentEmail,
        agentName: agentName,
        subject,
        message,
      });

      if (result.success) {
        toast({
          title: "Email sent successfully",
          description: `Your message has been sent to ${agentName}`,
        });
        setOpen(false);
      } else {
        toast({
          title: "Failed to send email",
          description:
            result.error || "An error occurred while sending the email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
            <DialogDescription>
              Send an email to {agentName} regarding their property &quot;
              {property.title}&quot;
              {!agentEmail && (
                <p className="text-red-500 mt-2">
                  Warning: Agent email is not available. You won&apos;t be able
                  to send an email.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-type">Email Template</Label>
              <Select value={templateType} onValueChange={updateTemplate}>
                <SelectTrigger id="template-type">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {!property.isActive && (
                    <SelectItem value="activation">
                      Property Activation Request
                    </SelectItem>
                  )}
                  <SelectItem value="update">
                    Property Update Request
                  </SelectItem>
                  <SelectItem value="feedback">Feedback Request</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !agentEmail}>
              {loading ? (
                <p className="flex items-center">
                  <Loader2 className="animate-spin mr-2" /> Sending
                </p>
              ) : (
                "Send Email"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
