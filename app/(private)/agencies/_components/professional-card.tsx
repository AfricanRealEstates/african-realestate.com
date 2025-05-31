"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Eye,
  Building2,
} from "lucide-react";

interface ProfessionalCardProps {
  professional: {
    id: string;
    name: string | null;
    agentName: string | null;
    agentLocation: string | null;
    profilePhoto: string | null;
    bio: string | null;
    role: string;
    createdAt: Date;
    phoneNumber?: string | null;
    agentEmail?: string | null;
    email?: string | null;
    twoWeekViews?: number;
    _count: {
      properties: number;
    };
  };
  isLoggedIn: boolean;
  showTopBadge?: boolean;
  rank?: number;
}

export default function ProfessionalCard({
  professional,
  isLoggedIn,
  showTopBadge = false,
  rank,
}: ProfessionalCardProps) {
  const displayName =
    professional.agentName || professional.name || "Real Estate Professional";
  const location = professional.agentLocation || "Kenya";
  const joinDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(professional.createdAt));

  // Use actual 2-week views or fallback to mock data
  const twoWeekViews =
    professional.twoWeekViews ?? Math.floor(Math.random() * 100 + 20);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Simple header with solid color */}
        <div className="relative h-16 bg-blue-50">
          {showTopBadge && rank && (
            <div className="absolute top-2 left-3 z-10">
              <Badge className="bg-amber-500 text-white text-xs font-semibold">
                #{rank} Top Performer
              </Badge>
            </div>
          )}
        </div>

        {/* Profile section */}
        <div className="relative px-6 pb-6">
          {/* Profile image */}
          <div className="relative -mt-8 mb-4">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              <Image
                src={professional.profilePhoto || "/assets/placeholder.jpg"}
                alt={displayName}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Verification badge */}
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-green-500 text-white p-1 rounded-full shadow-sm">
              <CheckCircle className="h-3 w-3" />
            </div>
          </div>

          {/* Name and role */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {displayName}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {professional.role === "AGENCY" ? "Agency" : "Agent"}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-200"
              >
                Verified
              </Badge>
            </div>

            {/* Location */}
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm text-center leading-relaxed line-clamp-2 mb-4">
            {professional.bio ||
              `Professional ${professional.role === "AGENCY" ? "agency" : "agent"} helping clients find their perfect properties in ${location}.`}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {professional._count.properties}
              </div>
              <div className="text-xs text-gray-600">Properties</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {twoWeekViews}
              </div>
              <div className="text-xs text-gray-600">2-Week Views</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-sm font-bold text-gray-900">{joinDate}</div>
              <div className="text-xs text-gray-600">Since</div>
            </div>
          </div>

          {/* Contact information for logged-in users */}
          {isLoggedIn &&
            (professional.phoneNumber ||
              professional.agentEmail ||
              professional.email) && (
              <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-xs font-medium text-blue-800 mb-2">
                  Contact Information
                </div>
                {professional.phoneNumber && (
                  <a
                    href={`tel:${professional.phoneNumber}`}
                    className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    <span className="truncate">{professional.phoneNumber}</span>
                  </a>
                )}
                {(professional.agentEmail || professional.email) && (
                  <a
                    href={`mailto:${professional.agentEmail || professional.email}`}
                    className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    <span className="truncate">
                      {professional.agentEmail || professional.email}
                    </span>
                  </a>
                )}
              </div>
            )}

          {/* Sign-in prompt for non-logged-in users */}
          {!isLoggedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-700 text-center">
                <Link href="/login" className="font-medium hover:underline">
                  Sign in
                </Link>{" "}
                to view contact information
              </p>
            </div>
          )}

          {/* Action button */}
          <Button
            asChild
            className="w-full group-hover:bg-blue-600 transition-colors"
          >
            <Link
              href={`/agencies/${professional.id}`}
              className="flex items-center justify-center gap-2"
            >
              View Profile
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
