"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Home,
  Factory,
  Umbrella,
  MapIcon,
  Users,
  Award,
  TrendingUp,
  Grid3X3,
  List,
  ChevronDown,
  MessageCircle,
  Share2,
  Calendar,
  Star,
  Eye,
  Heart,
  CheckCircle,
  Globe,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import PropertyCardEnhanced from "@/components/landing/featured-properties/property-card-enhanced";
import Pagination from "@/components/globals/Pagination";

interface AgencyProfileClientProps {
  agency: any;
  properties: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  propertyStats: any[];
  statusStats: any[];
  availablePropertyTypes: string[];
  availableStatuses: string[];
  isLoggedIn: boolean;
  searchParams: any;
}

export default function AgencyProfileClient({
  agency,
  properties,
  totalCount,
  totalPages,
  currentPage,
  propertyStats,
  statusStats,
  availablePropertyTypes,
  availableStatuses,
  isLoggedIn,
  searchParams,
}: AgencyProfileClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showContactInfo, setShowContactInfo] = useState(false);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // Create URL with updated search params
  const createUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlSearchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return `?${params.toString()}`;
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | undefined) => {
    const url = createUrl({ [key]: value, page: undefined }); // Reset page when filtering
    router.push(url);
  };

  // Handle sort changes
  const handleSortChange = (sort: string, order: string) => {
    const url = createUrl({ sort, order, page: undefined });
    router.push(url);
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="h-4 w-4" />;
      case "Commercial":
        return <Building className="h-4 w-4" />;
      case "Industrial":
        return <Factory className="h-4 w-4" />;
      case "Vacational / Social":
        return <Umbrella className="h-4 w-4" />;
      case "Land":
        return <MapIcon className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  // Format join date
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  // Calculate total views across all properties
  const totalViews = properties.reduce((sum, property) => {
    return sum + (property.views?.length || 0);
  }, 0);

  // Calculate total likes across all properties
  const totalLikes = properties.reduce((sum, property) => {
    return sum + (property.likes?.length || 0);
  }, 0);

  // Calculate average rating (mock data for now)
  const averageRating = 4.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 pt-16">
      {/* Enhanced Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-16 lg:pt-32 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              {/* Enhanced Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100 relative">
                  <Image
                    src={agency.profilePhoto || "/assets/placeholder.jpg"}
                    alt={agency.agentName || agency.name || "Agency"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Professional Badge */}
                <div className="hidden absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-lg">
                  {agency.role === "AGENCY" ? (
                    <Building className="h-5 w-5" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                </div>
                {/* Verification Badge */}
                <div className="hidden absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>

              {/* Agency Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {agency.agentName ||
                        agency.name ||
                        "Real Estate Professional"}
                    </h1>
                    <div className="flex gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                        {agency.role === "AGENCY" ? "Agency" : "Agent"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 bg-green-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  {/* Location and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    {agency.agentLocation && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {agency.agentLocation}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {averageRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        (24 reviews)
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          Properties
                        </span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        {agency._count.properties}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">
                          Total Views
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        {totalViews.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">
                          Total Likes
                        </span>
                      </div>
                      <div className="text-xl font-bold text-purple-900">
                        {totalLikes}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">
                          Since
                        </span>
                      </div>
                      <div className="text-sm font-bold text-amber-900">
                        {formatJoinDate(agency.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:w-80 space-y-4">
              <Card className="border-0 shadow-lg bg-gray-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Get in Touch
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Connect with this professional for your property needs
                      </p>
                    </div>

                    {isLoggedIn ? (
                      <div className="space-y-3">
                        {agency.phoneNumber && (
                          <a
                            href={`tel:${agency.phoneNumber}`}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                Call Now
                              </div>
                              {/* <div className="text-xs text-gray-600">
                                {agency.phoneNumber}
                              </div> */}
                            </div>
                          </a>
                        )}

                        {(agency.agentEmail || agency.email) && (
                          <Link
                            href={`mailto:${agency.agentEmail || agency.email}`}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                          >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                              <Mail className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                Send Email
                              </div>
                              {/* <div className="text-xs text-gray-600">
                                {agency.agentEmail || agency.email}
                              </div> */}
                            </div>
                          </Link>
                        )}

                        {agency.whatsappNumber && (
                          <a
                            href={`https://wa.me/${agency.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                          >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                WhatsApp
                              </div>
                              <div className="text-xs text-gray-600">
                                Quick message
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Phone className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 mb-3">
                          Sign in to view contact information and connect with
                          this professional
                        </p>
                        <Link href="/login">
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                            Sign In to Contact
                          </Button>
                        </Link>
                      </div>
                    )}

                    <Separator />

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: agency.agentName || agency.name,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Section */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  About {agency.role === "AGENCY" ? "Agency" : "Agent"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agency.bio ? (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {agency.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Professional real estate services in{" "}
                    {agency.agentLocation || "Africa"}
                  </p>
                )}

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {agency.role === "AGENCY"
                        ? "Real Estate Agency"
                        : "Real Estate Agent"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Serving {agency.agentLocation || "Multiple Locations"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Member since {formatJoinDate(agency.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Statistics */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        Active Listings
                      </span>
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {agency._count.properties}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Properties available
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">
                        Total Views
                      </span>
                      <Eye className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {totalViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Across all properties
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">
                        Engagement
                      </span>
                      <Heart className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {totalLikes}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Total likes received
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-700">
                        Avg. Views
                      </span>
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {Math.round(
                        totalViews / Math.max(agency._count.properties, 1)
                      )}
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      Per property
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Property Types */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="h-4 w-4 text-purple-600" />
                  </div>
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {propertyStats.map((stat) => (
                  <div
                    key={stat.propertyType}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getPropertyTypeIcon(stat.propertyType)}
                      </div>
                      <span className="text-sm font-medium">
                        {stat.propertyType}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      {stat._count.id}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Status Distribution */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Award className="h-4 w-4 text-amber-600" />
                  </div>
                  Listing Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusStats.map((stat) => (
                  <div
                    key={stat.status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg shadow-sm ${
                          stat.status === "sale"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {stat.status === "sale" ? (
                          <Award className="h-4 w-4 text-green-600" />
                        ) : (
                          <Home className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {stat.status === "sale" ? "For Sale" : "To Let"}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        stat.status === "sale"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {stat._count.id}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Filters and Controls */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                      Property Portfolio
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>
                        Showing {properties.length} of {totalCount} properties
                      </span>
                      {(searchParams.propertyType || searchParams.status) && (
                        <Badge variant="outline" className="text-xs">
                          Filtered
                        </Badge>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Enhanced Filters */}
                    <div className="flex gap-2">
                      <Select
                        value={searchParams.propertyType || "all"}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "propertyType",
                            value === "all" ? undefined : value
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px] border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {availablePropertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {getPropertyTypeIcon(type)}
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={searchParams.status || "all"}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "status",
                            value === "all" ? undefined : value
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px] border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {availableStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status === "sale" ? "For Sale" : "To Let"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Enhanced Sort and View Mode */}
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 hover:border-blue-500"
                          >
                            Sort <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleSortChange("createdAt", "desc")
                            }
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Newest First
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSortChange("createdAt", "asc")}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Oldest First
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSortChange("price", "asc")}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Price: Low to High
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSortChange("price", "desc")}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Price: High to Low
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-none border-0"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-none border-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Grid/List */}
            {properties.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {properties.map((property, index) => (
                    <PropertyCardEnhanced
                      key={property.id}
                      property={property}
                      index={index}
                    />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="bg-white rounded-lg shadow-lg p-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    This professional doesn&apos;t have any properties matching
                    your current filters. Try adjusting your search criteria.
                  </p>
                  {(searchParams.propertyType || searchParams.status) && (
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push(`/agencies/${agency.id}`)}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
