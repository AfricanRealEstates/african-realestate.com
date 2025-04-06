"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Search, Send } from "lucide-react";
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
import { sendMarketingEmail, getEmailTemplates } from "./actions";

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
};

export function InactivePropertiesMessages() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Fetch templates from the database
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const fetchedTemplates = await getEmailTemplates("inactive-property");
        setTemplates([
          ...fetchedTemplates,
          {
            id: "custom",
            name: "Custom Message",
            content: "",
            type: "inactive-property",
            isDefault: false,
          },
        ]);

        // Set default template if available
        const defaultTemplate = fetchedTemplates.find((t) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate.id);
          setCustomMessage(defaultTemplate.content);
        }
      } catch (error) {
        toast.error("Failed to load email templates");
      } finally {
        setLoadingTemplates(false);
      }
    }

    fetchTemplates();
  }, []);

  // This now uses a real API call to search properties
  const searchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/properties/search?term=${searchTerm}&status=inactive`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setProperties(data);

      if (data.length === 0) {
        toast.info(
          "No inactive properties found matching your search criteria"
        );
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

    setSending(true);
    try {
      await sendMarketingEmail({
        properties: selectedProperties,
        message: customMessage,
        templateId: selectedTemplate,
        type: "inactive-property",
      });

      toast.success(
        `Reactivation emails sent to ${selectedProperties.length} property owners`
      );

      setSelectedProperties([]);
      setCustomMessage("");
      setSelectedTemplate("");
    } catch (error) {
      toast.error("Failed to send reactivation emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Inactive Properties</CardTitle>
          <CardDescription>
            Select inactive properties to send reactivation messages
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
                  : "Search for inactive properties to display results"}
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
          <CardTitle>Compose Reactivation Message</CardTitle>
          <CardDescription>
            Create a message to encourage property reactivation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your reactivation message here..."
                rows={8}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
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
              loadingTemplates
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
                Send Reactivation Emails
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
