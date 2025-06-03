"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Search,
  Send,
  Mail,
  Users,
  History,
  Calendar,
  User,
  Building2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  sendMarketingEmail,
  getEmailTemplates,
  getEmailSenders,
  getMarketingEmailHistory,
  searchPropertiesByRole,
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
    name: string | null;
    email: string | null;
    role: string;
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

type EmailHistory = {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  type: string;
  senderEmail: string | null;
  sentAt: Date;
  property: {
    title: string;
    propertyNumber: number;
  };
  user: {
    name: string | null;
    email: string | null;
    role: string;
  };
};

export function ActivePropertiesMessages() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [senders, setSenders] = useState<EmailSender[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [propertyNumberFrom, setPropertyNumberFrom] = useState("");
  const [propertyNumberTo, setPropertyNumberTo] = useState("");

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

          if (defaultTemplate.senderEmail) {
            setSelectedSender(defaultTemplate.senderEmail);
          } else if (fetchedSenders.length > 0) {
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

  // Fetch email history
  const fetchEmailHistory = async () => {
    setLoadingHistory(true);
    try {
      const history = await getMarketingEmailHistory("active-property");
      setEmailHistory(history);
    } catch (error) {
      toast.error("Failed to load email history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchEmailHistory();
    }
  }, [activeTab]);

  // Search properties with role filtering
  const searchProperties = async () => {
    setLoading(true);
    try {
      const data = await searchPropertiesByRole({
        term: searchTerm,
        status: "active",
        role: selectedRole,
        propertyNumberFrom: propertyNumberFrom
          ? Number.parseInt(propertyNumberFrom)
          : undefined,
        propertyNumberTo: propertyNumberTo
          ? Number.parseInt(propertyNumberTo)
          : undefined,
      });

      setProperties(data);

      if (data.length === 0) {
        toast.info("No properties found matching your search criteria");
      } else if (data.length > 0) {
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
    setPreviewProperty(property);
  };

  const selectAllProperties = () => {
    setSelectedProperties(properties);
  };

  const clearSelection = () => {
    setSelectedProperties([]);
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

      // Refresh history if on history tab
      if (activeTab === "history") {
        fetchEmailHistory();
      }
    } catch (error) {
      toast.error("Failed to send marketing emails");
    } finally {
      setSending(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "AGENT":
        return <User className="h-4 w-4" />;
      case "AGENCY":
        return <Building2 className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "AGENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "AGENCY":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Active Properties Marketing
          </h2>
          <p className="text-gray-600">
            Send marketing messages to active property owners
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {emailHistory.length} emails sent
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Compose Message
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Email History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Properties
                </CardTitle>
                <CardDescription>
                  Select properties to send marketing messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filter Controls */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
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
                      <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              All Roles
                            </div>
                          </SelectItem>
                          <SelectItem value="AGENT">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Agents
                            </div>
                          </SelectItem>
                          <SelectItem value="AGENCY">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Agencies
                            </div>
                          </SelectItem>
                          <SelectItem value="USER">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Users
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={searchProperties} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Property Number Range Filter */}
                    <div className="flex gap-2 items-center">
                      <Label className="text-sm font-medium whitespace-nowrap">
                        Property #:
                      </Label>
                      <Input
                        placeholder="From"
                        value={propertyNumberFrom}
                        onChange={(e) => setPropertyNumberFrom(e.target.value)}
                        className="w-24"
                        type="number"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        placeholder="To"
                        value={propertyNumberTo}
                        onChange={(e) => setPropertyNumberTo(e.target.value)}
                        className="w-24"
                        type="number"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPropertyNumberFrom("");
                          setPropertyNumberTo("");
                        }}
                        disabled={!propertyNumberFrom && !propertyNumberTo}
                      >
                        Clear Range
                      </Button>
                    </div>
                  </div>

                  {/* Selection Controls */}
                  {properties.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllProperties}
                          disabled={
                            selectedProperties.length === properties.length
                          }
                        >
                          Select All ({properties.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                          disabled={selectedProperties.length === 0}
                        >
                          Clear Selection
                        </Button>
                      </div>
                      <Badge variant="secondary">
                        {selectedProperties.length} selected
                      </Badge>
                    </div>
                  )}

                  {/* Properties List */}
                  <div className="border rounded-md">
                    {properties.length > 0 ? (
                      <div className="divide-y max-h-[400px] overflow-y-auto">
                        {properties.map((property) => (
                          <div
                            key={property.id}
                            className="p-3 flex items-center justify-between hover:bg-muted cursor-pointer"
                            onClick={() => togglePropertySelection(property)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{property.title}</p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getRoleColor(property.user.role)}`}
                                >
                                  <div className="flex items-center gap-1">
                                    {getRoleIcon(property.user.role)}
                                    {property.user.role}
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                #{property.propertyNumber} • {property.status}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Owner: {property.user.name || "Unknown"} (
                                {property.user.email || "No email"})
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                selectedProperties.some(
                                  (p) => p.id === property.id
                                )
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-input"
                              }`}
                            >
                              {selectedProperties.some(
                                (p) => p.id === property.id
                              ) && <Check className="h-4 w-4" />}
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
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Compose Message
                </CardTitle>
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
                              &lt;
                              {selectedSender ||
                                "noreply@african-realestate.com"}
                              &gt;
                            </span>
                          </div>
                          <ActivePropertyEmail
                            propertyTitle={previewProperty.title}
                            propertyNumber={previewProperty.propertyNumber}
                            ownerName={previewProperty.user.name!}
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
                      Send to {selectedProperties.length} Properties
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Email History - Active Properties
              </CardTitle>
              <CardDescription>
                View all marketing emails sent to active property owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : emailHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No emails sent yet
                  </h3>
                  <p className="text-gray-600">
                    Start sending marketing emails to see the history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emailHistory.map((email) => (
                    <div
                      key={email.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {email.property.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              #{email.property.propertyNumber}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRoleColor(email.user.role)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getRoleIcon(email.user.role)}
                                {email.user.role}
                              </div>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>To:</strong>{" "}
                              {email.user.name || "Unknown"} (
                              {email.user.email || "No email"})
                            </p>
                            <p>
                              <strong>From:</strong>{" "}
                              {email.senderEmail ||
                                "noreply@african-realestate.com"}
                            </p>
                            <p>
                              <strong>Sent:</strong>{" "}
                              {new Date(email.sentAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(email.sentAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <p className="line-clamp-3">{email.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
