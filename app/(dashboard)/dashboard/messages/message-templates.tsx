"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Loader2,
  Plus,
  Save,
  Trash,
  Mail,
  Eye,
  Copy,
  Send,
  Building2,
  Users,
  Target,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getEmailSenders,
  createEmailSender,
  deleteEmailSender,
} from "./actions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Updated Template type to match the server response
type Template = {
  id: string;
  name: string;
  content: string;
  type: string;
  isDefault: boolean;
  targetRole: string | null;
  senderEmail: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type EmailSender = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
};

// Predefined modern templates for African Real Estate
const TEMPLATE_SUGGESTIONS = {
  "active-property": [
    {
      name: "Premium Property Showcase",
      content: `Dear {userName},

🏡 **Exciting News About Your Premium Property!**

Your stunning property "{propertyTitle}" (#{propertyNumber}) is performing exceptionally well on our platform!

**What's Happening:**
✨ Your property has received significant interest from qualified buyers
📈 Market conditions in your area are favorable for premium properties
🎯 We're implementing targeted marketing strategies to maximize exposure

**African Real Estate Advantage:**
• Access to our network of 50,000+ verified buyers across Africa
• Professional photography and virtual tour services
• Dedicated property consultant support
• Advanced analytics and market insights

**Next Steps:**
We recommend scheduling a property consultation to discuss optimization strategies that could increase your property's visibility by up to 40%.

Ready to maximize your property's potential? Let's connect!

Best regards,
The African Real Estate Team

P.S. Visit our success stories at african-realestate.com/success to see how we've helped property owners like you achieve remarkable results.`,
    },
    {
      name: "Market Update & Opportunities",
      content: `Hello {userName},

📊 **Quarterly Market Update for Property #{propertyNumber}**

Great news! The real estate market in your area is showing strong growth, and your property "{propertyTitle}" is well-positioned to benefit.

**Market Highlights:**
• 15% increase in buyer inquiries this quarter
• Average property values up 8% in your neighborhood
• Reduced time on market for premium listings

**Your Property's Performance:**
🔥 High-demand location
💎 Premium features that buyers are seeking
📱 Enhanced online presence driving quality leads

**Exclusive Opportunities:**
• Featured listing placement (limited time)
• Professional staging consultation
• Drone photography package
• Social media marketing boost

**African Real Estate's Commitment:**
With over 15 years of experience in African real estate markets, we're committed to delivering exceptional results for property owners like you.

Let's schedule a call to discuss how we can leverage these market conditions for your property.

Warm regards,
Your African Real Estate Team`,
    },
  ],
  "inactive-property": [
    {
      name: "Reactivation Opportunity",
      content: `Dear {userName},

🌟 **Your Property is Missing Out on Amazing Opportunities!**

We noticed your property "{propertyTitle}" (#{propertyNumber}) has been inactive, and we wanted to reach out because the market has never been better!

**Why Reactivate Now?**
📈 Property demand has increased by 25% in the last 6 months
💰 Average sale prices in your area are up 12%
🎯 We've enhanced our marketing platform with AI-powered buyer matching

**What You've Been Missing:**
• 1,200+ new buyer registrations monthly
• Advanced virtual tour technology
• Social media marketing to 100K+ followers
• Professional photography services

**Exclusive Reactivation Benefits:**
✅ FREE property valuation update
✅ Complimentary professional photos
✅ Priority listing placement for 30 days
✅ Dedicated account manager support

**African Real Estate's Promise:**
We're not just a listing platform - we're your partners in success. Our team of local experts understands the African real estate market like no one else.

Ready to get back in the game? Reactivate today and let's make your property the next success story!

Click here to reactivate: african-realestate.com/reactivate

Best wishes,
The African Real Estate Team`,
    },
    {
      name: "Market Recovery & New Features",
      content: `Hello {userName},

🚀 **Exciting Platform Updates + Market Recovery News!**

Your property "{propertyTitle}" (#{propertyNumber}) is perfectly positioned to benefit from our latest platform enhancements and the recovering market.

**New Platform Features:**
🤖 AI-powered buyer matching system
📱 Mobile-first property showcase
🎥 360° virtual tour integration
📊 Real-time market analytics dashboard

**Market Recovery Indicators:**
• 30% increase in serious buyer inquiries
• International buyer interest up 45%
• Faster property sales (average 60 days)
• Premium property segment showing strongest growth

**Your Reactivation Package Includes:**
1. Professional market analysis report
2. Optimized property description with SEO
3. Social media marketing campaign
4. Email marketing to qualified buyer database
5. Featured placement on our homepage

**Why African Real Estate?**
We've facilitated over $2 billion in property transactions across Africa. Our deep market knowledge, combined with cutting-edge technology, ensures your property gets the attention it deserves.

Don't let another month pass by. Reactivate now and join the success stories!

Ready to restart your property journey?

Sincerely,
African Real Estate Success Team`,
    },
  ],
};

export function MessageTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [emailSenders, setEmailSenders] = useState<EmailSender[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<
    Omit<Template, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    content: "",
    type: "active-property",
    isDefault: false,
    targetRole: null,
    senderEmail: null,
  });
  const [newSender, setNewSender] = useState<Omit<EmailSender, "id">>({
    email: "",
    displayName: "",
    isActive: true,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingSender, setIsCreatingSender] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSenderDialog, setOpenSenderDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedSenderFilter, setSelectedSenderFilter] =
    useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");

  // Fetch templates and email senders from the database
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedTemplates, fetchedSenders] = await Promise.all([
          getEmailTemplates(),
          getEmailSenders(),
        ]);
        setTemplates(fetchedTemplates);
        setEmailSenders(fetchedSenders);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsCreating(true);
    try {
      const templateToCreate = {
        name: newTemplate.name,
        content: newTemplate.content,
        type: newTemplate.type,
        isDefault: newTemplate.isDefault,
        targetRole: newTemplate.targetRole || undefined,
        senderEmail: newTemplate.senderEmail || undefined,
      };

      const createdTemplate = await createEmailTemplate(templateToCreate);

      setTemplates([...templates, createdTemplate]);
      setNewTemplate({
        name: "",
        content: "",
        type: "active-property",
        isDefault: false,
        targetRole: null,
        senderEmail: null,
      });
      setOpenDialog(false);

      toast.success("Template created successfully");
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSender = async () => {
    if (!newSender.email.trim() || !newSender.displayName.trim()) {
      toast.error("Please provide both an email and display name");
      return;
    }

    if (!newSender.email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    setIsCreatingSender(true);
    try {
      const createdSender = await createEmailSender(newSender);
      setEmailSenders([...emailSenders, createdSender]);
      setNewSender({
        email: "",
        displayName: "",
        isActive: true,
      });
      setOpenSenderDialog(false);
      toast.success("Email sender created successfully");
    } catch (error) {
      toast.error("Failed to create email sender");
    } finally {
      setIsCreatingSender(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setOpenEditDialog(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setOpenPreviewDialog(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsSaving(true);
    try {
      const templateToUpdate = {
        name: editingTemplate.name,
        content: editingTemplate.content,
        type: editingTemplate.type,
        isDefault: editingTemplate.isDefault,
        targetRole: editingTemplate.targetRole || undefined,
        senderEmail: editingTemplate.senderEmail || undefined,
      };

      const updatedTemplate = await updateEmailTemplate(
        editingTemplate.id,
        templateToUpdate
      );

      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? updatedTemplate : t
        )
      );
      setOpenEditDialog(false);

      toast.success("Template updated successfully");
    } catch (error) {
      toast.error("Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setIsDeleting(true);
      try {
        await deleteEmailTemplate(id);
        setTemplates(templates.filter((t) => t.id !== id));
        toast.success("Template deleted successfully");
      } catch (error) {
        toast.error("Failed to delete template");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteSender = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this sender? This will also affect templates using this sender."
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteEmailSender(id);
        setEmailSenders(emailSenders.filter((s) => s.id !== id));
        toast.success("Email sender deleted successfully");
      } catch (error) {
        toast.error("Failed to delete email sender");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUseSuggestion = (suggestion: any) => {
    setNewTemplate({
      ...newTemplate,
      name: suggestion.name,
      content: suggestion.content,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Template content copied to clipboard");
  };

  const filteredTemplates = templates.filter((template) => {
    const senderMatch =
      selectedSenderFilter === "all" ||
      template.senderEmail === selectedSenderFilter;
    const typeMatch =
      selectedTypeFilter === "all" || template.type === selectedTypeFilter;
    return senderMatch && typeMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Email Marketing Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage professional email templates for African Real
              Estate
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4" />
            <span>{templates.length} Templates</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{emailSenders.length} Senders</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Target className="h-4 w-4" />
            <span>Multi-role Targeting</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="senders" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Email Senders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Email Templates</h2>
              <div className="flex gap-2">
                <Select
                  value={selectedTypeFilter}
                  onValueChange={setSelectedTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="active-property">
                      Active Properties
                    </SelectItem>
                    <SelectItem value="inactive-property">
                      Inactive Properties
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSenderFilter}
                  onValueChange={setSelectedSenderFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Senders</SelectItem>
                    {emailSenders.map((sender) => (
                      <SelectItem key={sender.id} value={sender.email}>
                        {sender.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Create New Email Template
                  </DialogTitle>
                  <DialogDescription>
                    Create a professional email template for African Real Estate
                    marketing campaigns
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                  {/* Form Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        placeholder="Enter template name"
                        value={newTemplate.name}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-type">Template Type</Label>
                        <Select
                          value={newTemplate.type}
                          onValueChange={(value) =>
                            setNewTemplate({ ...newTemplate, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select template type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active-property">
                              Active Properties
                            </SelectItem>
                            <SelectItem value="inactive-property">
                              Inactive Properties
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template-target-role">
                          Target Role
                        </Label>
                        <Select
                          value={newTemplate.targetRole || ""}
                          onValueChange={(value) =>
                            setNewTemplate({
                              ...newTemplate,
                              targetRole: value || null,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPPORT">Support</SelectItem>
                            <SelectItem value="AGENCY">Agency</SelectItem>
                            <SelectItem value="AGENT">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-sender">Sender Email</Label>
                      <Select
                        value={newTemplate.senderEmail || ""}
                        onValueChange={(value) =>
                          setNewTemplate({
                            ...newTemplate,
                            senderEmail: value || null,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sender email" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailSenders.map((sender) => (
                            <SelectItem key={sender.id} value={sender.email}>
                              {sender.displayName} ({sender.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="template-default">Set as Default</Label>
                        <Switch
                          id="template-default"
                          checked={newTemplate.isDefault}
                          onCheckedChange={(checked) =>
                            setNewTemplate({
                              ...newTemplate,
                              isDefault: checked,
                            })
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Default templates are automatically selected for new
                        campaigns
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-content">Template Content</Label>
                      <Textarea
                        id="template-content"
                        placeholder="Enter template content"
                        rows={12}
                        value={newTemplate.content}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            content: e.target.value,
                          })
                        }
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use placeholders: {"{userName}"}, {"{propertyTitle}"},{" "}
                        {"{propertyNumber}"}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Template Suggestions
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Professional templates designed for African Real Estate
                      </p>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {TEMPLATE_SUGGESTIONS[
                        newTemplate.type as keyof typeof TEMPLATE_SUGGESTIONS
                      ]?.map((suggestion, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              {suggestion.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {suggestion.content.substring(0, 150)}...
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => handleUseSuggestion(suggestion)}
                            >
                              Use This Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Template
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first professional email template to get started
                with marketing campaigns.
              </p>
              <Button onClick={() => setOpenDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {template.name}
                      </CardTitle>
                      <div className="flex gap-1">
                        {template.isDefault && (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            Default
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            template.type === "active-property"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {template.type === "active-property"
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <CardDescription className="space-y-2">
                      <p className="text-sm">
                        Professional template for{" "}
                        {template.type === "active-property"
                          ? "active"
                          : "inactive"}{" "}
                        property campaigns
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {template.senderEmail && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {template.senderEmail}
                          </Badge>
                        )}
                        {template.targetRole && (
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {template.targetRole}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="relative">
                      <div className="text-sm border rounded-md p-3 bg-muted/30 h-24 overflow-hidden">
                        <p className="line-clamp-3 text-muted-foreground">
                          {template.content}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(template.content)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="senders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Email Senders</h2>
            <Dialog open={openSenderDialog} onOpenChange={setOpenSenderDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email Sender
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-green-600" />
                    Add New Email Sender
                  </DialogTitle>
                  <DialogDescription>
                    Add a new email sender for African Real Estate marketing
                    campaigns
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Email Address</Label>
                    <Input
                      id="sender-email"
                      placeholder="e.g., marketing@african-realestate.com"
                      value={newSender.email}
                      onChange={(e) =>
                        setNewSender({ ...newSender, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Display Name</Label>
                    <Input
                      id="sender-name"
                      placeholder="e.g., African Real Estate Marketing"
                      value={newSender.displayName}
                      onChange={(e) =>
                        setNewSender({
                          ...newSender,
                          displayName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sender-active">Active Sender</Label>
                      <Switch
                        id="sender-active"
                        checked={newSender.isActive}
                        onCheckedChange={(checked) =>
                          setNewSender({ ...newSender, isActive: checked })
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active senders can be used for sending marketing emails
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenSenderDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSender}
                    disabled={isCreatingSender}
                  >
                    {isCreatingSender ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Add Sender
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {emailSenders.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No email senders found
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first email sender to start sending professional
                marketing campaigns.
              </p>
              <Button onClick={() => setOpenSenderDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Sender
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {emailSenders.map((sender) => (
                <Card
                  key={sender.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${sender.displayName}`}
                          />
                          <AvatarFallback>
                            {sender.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {sender.displayName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {sender.email}
                          </CardDescription>
                        </div>
                      </div>
                      {sender.isActive ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 border-red-200"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Templates using this sender:
                        </span>
                        <span className="font-medium">
                          {
                            templates.filter(
                              (t) => t.senderEmail === sender.email
                            ).length
                          }
                        </span>
                      </div>
                      <Separator />
                      <div className="text-xs text-muted-foreground">
                        Professional sender for African Real Estate campaigns
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end pt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSender(sender.id)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Template
            </DialogTitle>
            <DialogDescription>
              Update your email template for marketing campaigns
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  placeholder="Enter template name"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-type">Template Type</Label>
                  <Select
                    value={editingTemplate.type}
                    onValueChange={(value) =>
                      setEditingTemplate({ ...editingTemplate, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active-property">
                        Active Properties
                      </SelectItem>
                      <SelectItem value="inactive-property">
                        Inactive Properties
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-template-target-role">Target Role</Label>
                  <Select
                    value={editingTemplate.targetRole || ""}
                    onValueChange={(value) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        targetRole: value || null,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPPORT">Support</SelectItem>
                      <SelectItem value="AGENCY">Agency</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-sender">Sender Email</Label>
                <Select
                  value={editingTemplate.senderEmail || ""}
                  onValueChange={(value) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      senderEmail: value || null,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sender email" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailSenders.map((sender) => (
                      <SelectItem key={sender.id} value={sender.email}>
                        {sender.displayName} ({sender.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-template-default">Set as Default</Label>
                  <Switch
                    id="edit-template-default"
                    checked={editingTemplate.isDefault}
                    onCheckedChange={(checked) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        isDefault: checked,
                      })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Default templates are automatically selected for new campaigns
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-content">Template Content</Label>
                <Textarea
                  id="edit-template-content"
                  placeholder="Enter template content"
                  rows={12}
                  value={editingTemplate.content}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      content: e.target.value,
                    })
                  }
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use placeholders: {"{userName}"}, {"{propertyTitle}"},{" "}
                  {"{propertyNumber}"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Template Dialog */}
      <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Template Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your email template will look to recipients
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{previewTemplate.name}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">
                    {previewTemplate.type === "active-property"
                      ? "Active Properties"
                      : "Inactive Properties"}
                  </Badge>
                  {previewTemplate.targetRole && (
                    <Badge variant="secondary">
                      {previewTemplate.targetRole}
                    </Badge>
                  )}
                  {previewTemplate.senderEmail && (
                    <Badge variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      {previewTemplate.senderEmail}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <p className="text-sm text-muted-foreground">
                      From:{" "}
                      {previewTemplate.senderEmail ||
                        "noreply@african-realestate.com"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To: john.doe@example.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subject:{" "}
                      {previewTemplate.type === "active-property"
                        ? "Marketing Update for Your Property #12345"
                        : "Reactivate Your Property #12345"}
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: previewTemplate.content
                          .replace(/{userName}/g, "<strong>John Doe</strong>")
                          .replace(
                            /{propertyTitle}/g,
                            "<strong>Luxury Villa in Lagos</strong>"
                          )
                          .replace(
                            /{propertyNumber}/g,
                            "<strong>12345</strong>"
                          )
                          .replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenPreviewDialog(false)}
            >
              Close Preview
            </Button>
            <Button
              onClick={() =>
                previewTemplate && copyToClipboard(previewTemplate.content)
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
