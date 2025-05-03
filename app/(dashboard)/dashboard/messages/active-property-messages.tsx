"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Search, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  sendMarketingEmail,
  getEmailTemplates,
  getEmailSenders,
} from "./actions";
import { ActivePropertyEmail } from "./active-property";

type Property = {
  id: string;
  title: string;
  propertyNumber: number;
  status: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type EmailTemplate = {
  id: string;
  name: string;
  content: string;
  type: string;
  isDefault: boolean;
  senderEmail: string | null;
  targetRole: string | null;
};

type EmailSender = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
};

export function ActivePropertiesMessages() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [senders, setSenders] = useState<EmailSender[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch templates and senders from the database
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedTemplates, fetchedSenders] = await Promise.all([
          getEmailTemplates("active-property"),
          getEmailSenders(),
        ]);

        setTemplates([
          ...fetchedTemplates,
          {
            id: "custom",
            name: "Custom Message",
            content: "",
            type: "active-property",
            isDefault: false,
            senderEmail: null,
            targetRole: null,
          },
        ]);
        setSenders(fetchedSenders);

        // Set default template if available
        const defaultTemplate = fetchedTemplates.find((t) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate.id);
          setCustomMessage(defaultTemplate.content);

          // If the default template has a sender, select it
          if (defaultTemplate.senderEmail) {
            setSelectedSender(defaultTemplate.senderEmail);
          } else if (fetchedSenders.length > 0) {
            // Otherwise select the first available sender
            setSelectedSender(fetchedSenders[0].email);
          }
        }
      } catch (error) {
        toast.error("Failed to load email templates and senders");
      } finally {
        setLoadingTemplates(false);
      }
    }

    fetchData();
  }, []);

  // This now uses a real API call to search properties
  const searchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/properties/search?term=${searchTerm}&status=active`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setProperties(data);

      if (data.length === 0) {
        toast.info("No properties found matching your search criteria");
      } else if (data.length > 0) {
        // Set the first property as preview property
        setPreviewProperty(data[0]);
      }
    } catch (error) {
      toast.error("Failed to search properties");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== "custom") {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setCustomMessage(template.content);

        // If template has a sender, select it
        if (template.senderEmail) {
          setSelectedSender(template.senderEmail);
        }
      }
    } else {
      setCustomMessage("");
    }
  };

  const togglePropertySelection = (property: Property) => {
    if (selectedProperties.some((p) => p.id === property.id)) {
      setSelectedProperties(
        selectedProperties.filter((p) => p.id !== property.id)
      );
    } else {
      setSelectedProperties([...selectedProperties, property]);
    }

    // Set as preview property
    setPreviewProperty(property);
  };

  const handleSendEmails = async () => {
    if (selectedProperties.length === 0) {
      toast.error("Please select at least one property to send messages");
      return;
    }

    if (!customMessage.trim()) {
      toast.error("Please enter a message to send");
      return;
    }

    if (!selectedSender) {
      toast.error("Please select a sender email");
      return;
    }

    setSending(true);
    try {
      await sendMarketingEmail({
        properties: selectedProperties,
        message: customMessage,
        templateId: selectedTemplate,
        type: "active-property",
        senderEmail: selectedSender,
      });

      toast.success(
        `Marketing emails sent to ${selectedProperties.length} property owners`
      );

      setSelectedProperties([]);
      setCustomMessage("");
      setSelectedTemplate("");
    } catch (error) {
      toast.error("Failed to send marketing emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Active Properties</CardTitle>
          <CardDescription>
            Select properties to send marketing messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search by property number, title or owner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchProperties();
                }
              }}
            />
            <Button onClick={searchProperties} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="border rounded-md">
            {properties.length > 0 ? (
              <div className="divide-y max-h-[300px] md:max-h-[400px] overflow-y-auto">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="p-3 flex items-center justify-between hover:bg-muted cursor-pointer"
                    onClick={() => togglePropertySelection(property)}
                  >
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        #{property.propertyNumber} • {property.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Owner: {property.user.name}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        selectedProperties.some((p) => p.id === property.id)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input"
                      }`}
                    >
                      {selectedProperties.some((p) => p.id === property.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {loading
                  ? "Searching properties..."
                  : "Search for properties to display results"}
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {selectedProperties.length > 0 ? (
              <p>{selectedProperties.length} properties selected</p>
            ) : (
              <p>No properties selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
          <CardDescription>
            Create a marketing message for selected properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                {loadingTemplates ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading templates...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={selectedTemplate}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender">Sender Email</Label>
                <Select
                  value={selectedSender}
                  onValueChange={setSelectedSender}
                  disabled={loadingTemplates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sender email" />
                  </SelectTrigger>
                  <SelectContent>
                    {senders
                      .filter((s) => s.isActive)
                      .map((sender) => (
                        <SelectItem key={sender.id} value={sender.email}>
                          {sender.displayName} ({sender.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your marketing message here..."
                rows={8}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can use placeholders like {"{userName}"},{" "}
                {"{propertyTitle}"}, {"{propertyNumber}"}, etc.
              </p>
            </div>

            {previewProperty && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Email Preview</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>

                {showPreview && (
                  <div className="border rounded-md p-4 max-h-[400px] overflow-auto">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>
                        From:{" "}
                        {senders.find((s) => s.email === selectedSender)
                          ?.displayName || "African Real Estate"}
                        &lt;{selectedSender || "noreply@african-realestate.com"}
                        &gt;
                      </span>
                    </div>
                    <ActivePropertyEmail
                      propertyTitle={previewProperty.title}
                      propertyNumber={previewProperty.propertyNumber}
                      ownerName={previewProperty.user.name}
                      message={customMessage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSendEmails}
            disabled={
              sending ||
              selectedProperties.length === 0 ||
              !customMessage.trim() ||
              loadingTemplates ||
              !selectedSender
            }
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Marketing Emails
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
