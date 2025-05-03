"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2, Plus, Save, Trash, Mail } from "lucide-react";
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

export function MessageTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [emailSenders, setEmailSenders] = useState<EmailSender[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
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
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedSenderFilter, setSelectedSenderFilter] =
    useState<string>("all");

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

  // Fix the handleCreateTemplate function to convert null to undefined
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsCreating(true);
    try {
      // Convert null values to undefined for API compatibility
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

  // Fix the handleSaveTemplate function to convert null to undefined
  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsSaving(true);
    try {
      // Convert null values to undefined for API compatibility
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

  const filteredTemplates =
    selectedSenderFilter === "all"
      ? templates
      : templates.filter((t) => t.senderEmail === selectedSenderFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="senders">Email Senders</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Email Templates</h2>

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
                      {sender.displayName} ({sender.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a new email template for marketing messages
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                    />
                  </div>
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
                    <Label htmlFor="template-target-role">
                      Target User Role
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
                        <SelectValue placeholder="Select target user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPPORT">Support</SelectItem>
                        <SelectItem value="AGENCY">Agency</SelectItem>
                        <SelectItem value="AGENT">Agent</SelectItem>
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
                          setNewTemplate({ ...newTemplate, isDefault: checked })
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If set as default, this template will be automatically
                      selected when creating new messages.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-content">Template Content</Label>
                    <Textarea
                      id="template-content"
                      placeholder="Enter template content"
                      rows={8}
                      value={newTemplate.content}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          content: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      You can use placeholders like {"{userName}"},{" "}
                      {"{propertyTitle}"}, {"{propertyNumber}"}, etc.
                    </p>
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

          {filteredTemplates.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/50">
              <p className="text-muted-foreground">
                No templates found. Create your first template to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{template.name}</span>
                      <div className="flex items-center gap-2">
                        {template.isDefault && (
                          <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">
                            Default
                          </span>
                        )}
                        <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full">
                          {template.type === "active-property"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <span>
                        Email template for{" "}
                        {template.type === "active-property"
                          ? "active"
                          : "inactive"}{" "}
                        properties
                      </span>
                      {template.senderEmail && (
                        <Badge variant="outline" className="w-fit">
                          <Mail className="h-3 w-3 mr-1" />
                          {template.senderEmail}
                        </Badge>
                      )}
                      {template.targetRole && (
                        <Badge variant="secondary" className="w-fit mt-1">
                          For: {template.targetRole}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm border rounded-md p-3 bg-muted/50 h-32 overflow-auto">
                      {template.content}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 sm:flex-nowrap sm:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      disabled={isDeleting}
                      className="flex-1"
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

        <TabsContent value="senders" className="space-y-4">
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-semibold">Email Senders</h2>
            <Dialog open={openSenderDialog} onOpenChange={setOpenSenderDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email Sender
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Email Sender</DialogTitle>
                  <DialogDescription>
                    Add a new email sender for marketing messages
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
                      placeholder="e.g., ARE Marketing Team"
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
                      <Label htmlFor="sender-active">Active</Label>
                      <Switch
                        id="sender-active"
                        checked={newSender.isActive}
                        onCheckedChange={(checked) =>
                          setNewSender({ ...newSender, isActive: checked })
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If active, this sender can be used for sending emails.
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
            <div className="text-center p-8 border rounded-md bg-muted/50">
              <p className="text-muted-foreground">
                No email senders found. Add your first email sender to get
                started.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {emailSenders.map((sender) => (
                <Card key={sender.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{sender.displayName}</span>
                      {sender.isActive ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {sender.email}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Templates using this sender:{" "}
                        {
                          templates.filter(
                            (t) => t.senderEmail === sender.email
                          ).length
                        }
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
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

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the email template for marketing messages
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
                <Label htmlFor="edit-template-target-role">
                  Target User Role
                </Label>
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
                    <SelectValue placeholder="Select target user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                    <SelectItem value="AGENCY">Agency</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>
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
                  If set as default, this template will be automatically
                  selected when creating new messages.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-content">Template Content</Label>
                <Textarea
                  id="edit-template-content"
                  placeholder="Enter template content"
                  rows={8}
                  value={editingTemplate.content}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      content: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  You can use placeholders like {"{userName}"},{" "}
                  {"{propertyTitle}"}, {"{propertyNumber}"}, etc.
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
    </div>
  );
}
