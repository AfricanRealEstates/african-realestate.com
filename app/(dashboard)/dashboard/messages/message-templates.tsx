"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2, Plus, Save, Trash } from "lucide-react";
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
} from "./actions";

type Template = {
  id: string;
  name: string;
  content: string;
  type: string;
  isDefault: boolean;
};

export function MessageTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Omit<Template, "id">>({
    name: "",
    content: "",
    type: "active-property",
    isDefault: false,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Fetch templates from the database
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const fetchedTemplates = await getEmailTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        toast.error("Failed to load email templates");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsCreating(true);
    try {
      const createdTemplate = await createEmailTemplate(newTemplate);

      setTemplates([...templates, createdTemplate]);
      setNewTemplate({
        name: "",
        content: "",
        type: "active-property",
        isDefault: false,
      });
      setOpenDialog(false);

      toast.success("Template created successfully");
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setOpenEditDialog(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.content.trim()) {
      toast.error("Please provide both a name and content for the template");
      return;
    }

    setIsSaving(true);
    try {
      const updatedTemplate = await updateEmailTemplate(editingTemplate.id, {
        name: editingTemplate.name,
        content: editingTemplate.content,
        type: editingTemplate.type,
        isDefault: editingTemplate.isDefault,
      });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Email Templates</h2>
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
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
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

      {templates.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">
            No templates found. Create your first template to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
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
                <CardDescription>
                  Email template for{" "}
                  {template.type === "active-property" ? "active" : "inactive"}{" "}
                  properties
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
