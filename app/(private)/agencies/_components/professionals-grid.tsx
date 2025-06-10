import { Suspense } from "react";
import ProfessionalCard from "./professional-card";
import { ProfessionalCardSkeleton } from "./professional-card-skeleton";

interface Professional {
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
  whatsappNumber?: string | null;
  twoWeekViews?: number;
  _count: {
    properties: number;
  };
}

interface ProfessionalsGridProps {
  professionals: Professional[];
  isLoggedIn: boolean;
  showTopBadges?: boolean;
  loading?: boolean;
}

export function ProfessionalsGrid({
  professionals,
  isLoggedIn,
  showTopBadges = false,
  loading = false,
}: ProfessionalsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProfessionalCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {professionals.map((professional, index) => (
        <Suspense key={professional.id} fallback={<ProfessionalCardSkeleton />}>
          <ProfessionalCard
            professional={professional}
            isLoggedIn={isLoggedIn}
            showTopBadge={showTopBadges}
            rank={showTopBadges ? index + 1 : undefined}
          />
        </Suspense>
      ))}
    </div>
  );
}
