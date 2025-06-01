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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendEmailToAgent } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Eye, Mail } from "lucide-react";
import {
  emailTemplates,
  getTemplatesByCategory,
  type EmailTemplate,
} from "./email-templates";

interface Property {
  id: string;
  title: string;
  isActive: boolean;
  propertyType?: string;
  location?: string;
  price?: number;
  currency?: string;
  user: {
    name: string | null;
    email: string | null;
  };
  // Additional fields for better templates
  views?: number;
  createdAt?: Date;
}

interface ContactAgentDialogProps {
  property: Property;
  trigger: React.ReactNode;
}

export default function ImprovedContactAgentDialog({
  property,
  trigger,
}: ContactAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const agentName = property.user.name || "Property Owner";
  const agentEmail = property.user.email;

  // Calculate days inactive for better template personalization
  const daysInactive = property.createdAt
    ? Math.floor(
        (Date.now() - new Date(property.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const templateData = {
    agentName,
    propertyTitle: property.title,
    propertyId: property.id,
    propertyType: property.propertyType,
    location: property.location,
    price: property.price,
    currency: property.currency,
    isActive: property.isActive,
    daysInactive,
    viewCount: property.views,
  };

  // Update the template selection to handle both string and function subjects
  const updateTemplate = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setSubject(
        typeof template.subject === "function"
          ? template.subject(templateData)
          : template.subject
      );
      setMessage(template.generateContent(templateData));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "activation":
        return "🚀";
      case "engagement":
        return "💡";
      case "feedback":
        return "⭐";
      case "marketing":
        return "📈";
      case "support":
        return "🤝";
      default:
        return "📧";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "activation":
        return "bg-red-100 text-red-800";
      case "engagement":
        return "bg-blue-100 text-blue-800";
      case "feedback":
        return "bg-yellow-100 text-yellow-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      case "support":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Agent - Enhanced Templates
          </DialogTitle>
          <DialogDescription>
            Send a professional email to {agentName} regarding &quot;
            {property.title}&quot;
            {!agentEmail && (
              <p className="text-red-500 mt-2">
                Warning: Agent email is not available.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Choose Template</TabsTrigger>
            <TabsTrigger value="compose">Compose & Send</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">
                Professional Email Templates
              </h3>

              {/* Quick recommendations */}
              <div className="grid gap-3">
                {!property.isActive && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-red-800">
                          🚨 Recommended for Inactive Property
                        </CardTitle>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateTemplate("property-activation-urgent")
                        }
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Use Activation Template
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {property.views && property.views > 20 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-green-800">
                          🎉 High-Performing Property
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          Trending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTemplate("success-celebration")}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Use Success Template
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* All templates by category */}
              <div className="space-y-4">
                {[
                  "activation",
                  "engagement",
                  "marketing",
                  "feedback",
                  "support",
                ].map((category) => {
                  const categoryTemplates = getTemplatesByCategory(
                    category as any
                  );
                  if (categoryTemplates.length === 0) return null;

                  return (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize flex items-center gap-2">
                        <span>{getCategoryIcon(category)}</span>
                        {category} Templates
                      </h4>
                      <div className="grid gap-2">
                        {categoryTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedTemplate?.id === template.id
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                            onClick={() => updateTemplate(template.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-sm">
                                      {template.name}
                                    </h5>
                                    <Badge
                                      className={getCategoryColor(
                                        template.category
                                      )}
                                      variant="secondary"
                                    >
                                      {template.category}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {template.description}
                                  </p>
                                </div>
                                {selectedTemplate?.id === template.id && (
                                  <div className="text-blue-500">
                                    <Eye className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedTemplate && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-blue-800">
                          Selected Template:
                        </p>
                        <p className="text-sm text-blue-600">
                          {selectedTemplate.name}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        {previewMode ? "Edit" : "Preview"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Enter email subject..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Email Content</Label>
                  {previewMode ? (
                    <div
                      className="min-h-[300px] p-4 border rounded-md bg-gray-50 overflow-auto"
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                  ) : (
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      required
                      placeholder="Enter your message..."
                    />
                  )}
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
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
