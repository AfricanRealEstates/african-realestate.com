"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  FileText,
  Home,
  Building,
  Warehouse,
  Palmtree,
  Map,
} from "lucide-react";
import { toast } from "sonner";
import { deleteGuide, getGuides } from "./actions";
import { formatDistanceToNow } from "date-fns";

type Guide = {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  guideType: string;
  published: boolean;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function GuidesList() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [guideTypeFilter, setGuideTypeFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  useEffect(() => {
    async function loadGuides() {
      try {
        const data = await getGuides();
        setGuides(data);
      } catch (error) {
        toast.error("Failed to load guides");
      } finally {
        setLoading(false);
      }
    }

    loadGuides();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this guide? This action cannot be undone."
      )
    ) {
      try {
        await deleteGuide(id);
        setGuides(guides.filter((guide) => guide.id !== id));
        toast.success("Guide deleted successfully");
      } catch (error) {
        toast.error("Failed to delete guide");
      }
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="h-4 w-4" />;
      case "Commercial":
        return <Building className="h-4 w-4" />;
      case "Industrial":
        return <Warehouse className="h-4 w-4" />;
      case "Vacational / Social":
        return <Palmtree className="h-4 w-4" />;
      case "Land":
        return <Map className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPropertyType =
      propertyTypeFilter === "all" || guide.propertyType === propertyTypeFilter;
    const matchesGuideType =
      guideTypeFilter === "all" || guide.guideType === guideTypeFilter;
    const matchesPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" && guide.published) ||
      (publishedFilter === "draft" && !guide.published);

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesGuideType &&
      matchesPublished
    );
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading guides...</CardTitle>
          <CardDescription>
            Please wait while we fetch the guides.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guides..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={propertyTypeFilter}
          onValueChange={setPropertyTypeFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Property Types</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Vacational / Social">
              Vacational / Social
            </SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
        <Select value={guideTypeFilter} onValueChange={setGuideTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Guide Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guide Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">To Let</SelectItem>
            <SelectItem value="sell">To Sell</SelectItem>
          </SelectContent>
        </Select>
        <Select value={publishedFilter} onValueChange={setPublishedFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredGuides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No guides found. Create your first guide to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Guide Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPropertyTypeIcon(guide.propertyType)}
                        {guide.propertyType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        For{" "}
                        {guide.guideType === "sell"
                          ? "Selling"
                          : guide.guideType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {guide.published ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(guide.updatedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/guides/${guide.slug}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/guides/${guide.id}/edit`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(guide.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
