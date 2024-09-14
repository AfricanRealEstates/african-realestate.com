"use client";

import { getRatings, saveRating, getUserRating } from "@/actions/rating-action";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState, useEffect, Suspense } from "react";
import { toast } from "sonner";

interface FeedbackWidgetProps {
  propertyId: string;
  propertyOwnerId: string; // To identify the owner
}

export default function FeedbackWidget({
  propertyId,
  propertyOwnerId,
}: FeedbackWidgetProps) {
  const [ratings, setRatings] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const [allRatings, setAllRatings] = useState<any[]>([]); // New state to hold all ratings
  const { data: session } = useSession();
  const user = session?.user;

  const isOwner = user?.id === propertyOwnerId;

  useEffect(() => {
    async function fetchRatingData() {
      const { averageRating, ratingsCount, ratingsList } = await getRatings(
        propertyId
      );

      setAverageRating(averageRating);
      setNumberOfRatings(ratingsCount);

      if (user && !isOwner) {
        const userRating = await getUserRating(user.id!, propertyId);
        if (userRating) {
          setUserHasRated(true);
          setRatings(+userRating.ratings);
        }
      }

      // If the user is the owner, fetch all ratings for the property
      if (isOwner) {
        setAllRatings(ratingsList); // Set all ratings to the state
      }
    }
    fetchRatingData();
  }, [propertyId, submitted, user, isOwner]);

  const getStarComponents = (rating: number, disabled: boolean = false) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon
            key={`full-${index}`}
            full
            className="fill-[#FFDA00]"
            disabled={disabled}
          />
        ))}
        {hasHalfStar && (
          <StarIcon
            key="half"
            half
            className="fill-white"
            disabled={disabled}
          />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <StarIcon
            key={`empty-${index}`}
            className="fill-white mr-1"
            disabled={disabled}
          />
        ))}
      </>
    );
  };

  const onSelectStar = (index: number) => {
    setRatings(index + 1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a rating.");
      return;
    }

    const ratingInfo = {
      ratings,
      propertyId,
      userId: user.id,
    };

    try {
      const response = await saveRating(ratingInfo);

      if (response.message === "Rating saved successfully") {
        setSubmitted(true);
        toast.success("Thank you for your rating!");
        const { averageRating, ratingsCount } = await getRatings(propertyId);
        setAverageRating(averageRating);
        setNumberOfRatings(ratingsCount);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to submit rating.");
    }
  };

  const getRatingMessage = (rating: number) => {
    if (rating > 4.5 && rating <= 5.0) return "💫️ Awesome Property";
    if (rating >= 4.0 && rating <= 4.5) return "🤩️ Excellent Property";
    if (rating >= 3.0 && rating < 4.0) return "🙂️ Perfect Property";
    if (rating >= 2.0 && rating < 3.0) return "🫡️ Good Property";
    if (rating >= 1.0 && rating < 2.0) return "🙂️ Okay Property";
    return "";
  };

  return (
    <>
      {isOwner ? (
        <div className="flex flex-col gap-4 -mt-3">
          {allRatings.length === 0 ? (
            <p className="text-blue-800 rounded-full bg-blue-100 px-1 py-1 text-xs">
              Property not rated yet.
            </p>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold">Ratings by others:</h3>
              <ul className="space-y-2">
                {allRatings.map((rating, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStarComponents(rating.ratings, true)}
                      <span className="ml-2 text-gray-600">
                        {rating.ratings.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{rating.userId}</p>{" "}
                    {/* You can customize this */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : userHasRated && averageRating > 0 ? (
        <Suspense fallback={<p>Loading...</p>}>
          <div className="flex space-y-2 flex-col text-blue-800 rounded-lg bg-gray-50 p-2 h-full">
            <p className="text-blue-600 text-sm font-semibold">
              {getRatingMessage(averageRating)}
            </p>
            <p className="text-gray-500 flex items-center">
              {getStarComponents(averageRating)}
              <span className="text-sm ml-2">({numberOfRatings})</span>
              <span className="text-rose-500 ml-1">
                {averageRating.toFixed(1)}
              </span>
            </p>
          </div>
        </Suspense>
      ) : (
        <div className="space-y-2">
          <h3 className="text-xs">✨️ Rate this property</h3>
          <form onSubmit={onSubmit} className="flex flex-col">
            <div className="flex flex-col items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`size-5 cursor-pointer ${
                      ratings > index ? "fill-[#FFDA00]" : "fill-white"
                    }`}
                    onClick={() => onSelectStar(index)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full text-sm text-blue-800 rounded-lg bg-blue-100 hover:bg-blue-50 py-0.5 px-3 transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function StarIcon({
  full = false,
  half = false,
  className = "",
  disabled = false,
  onClick,
}: any) {
  return (
    <svg
      onClick={disabled ? undefined : onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      fill={full ? "gold" : half ? "url(#halfGradient)" : "none"}
      stroke="gold"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <defs>
        <linearGradient id="halfGradient">
          <stop offset="50%" stopColor="gold" />
          <stop offset="50%" stopColor="none" />
        </linearGradient>
      </defs>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
