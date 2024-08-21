"use client";

// components/feedback-widget.tsx

import { getRatings, saveRating } from "@/actions/rating-action";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState, useEffect, Suspense } from "react";
import { toast } from "sonner";

interface FeedbackWidgetProps {
  propertyId: string;
}

export default function FeedbackWidget({ propertyId }: FeedbackWidgetProps) {
  const [ratings, setRatings] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [numberOfRatings, setNumberOfRatings] = useState<number>(0); // New state for number of ratings
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    async function fetchRatingData() {
      const { averageRating, ratingsCount } = await getRatings(propertyId);
      setAverageRating(averageRating);
      setNumberOfRatings(ratingsCount);
    }
    fetchRatingData();
  }, [propertyId, submitted]);

  // Handle star selection
  const onSelectStar = (index: number) => {
    setRatings(index + 1);
  };

  // Handle form submission
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a rating.");
      return;
    }

    const ratingInfo = {
      ratings,
      propertyId: propertyId,
      userId: user.id,
    };

    try {
      const response = await saveRating(ratingInfo);

      if (response.message === "Rating saved successfully") {
        setSubmitted(true);
        toast.success("Thank you for your rating!");
        // Fetch the updated average rating and number of ratings after submission
        const { averageRating, ratingsCount } = await getRatings(propertyId);
        setAverageRating(averageRating);
        setNumberOfRatings(numberOfRatings); // Update number of ratings
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to submit rating.");
    }
  };

  // Display rating message based on average rating value
  const getRatingMessage = (rating: number) => {
    if (rating >= 4.0 && rating <= 5.0) {
      return "🤩️ Excellent property";
    } else if (rating >= 3.0 && rating < 4.0) {
      return "🙂️ Good property";
    } else if (rating >= 2.0 && rating < 3.0) {
      return "🫡️ Ok property";
    } else if (rating >= 1.0 && rating < 2.0) {
      return "😡️ Awful property";
    } else {
      return "";
    }
  };

  return (
    <>
      {submitted || averageRating > 0 ? (
        <Suspense fallback={<p>Loading...</p>}>
          <div className="flex space-y-2 flex-col text-blue-800 rounded-lg bg-gray-50 p-2 h-full">
            <p className="text-blue-600 text-sm font-semibold">
              {getRatingMessage(averageRating)}
            </p>
            <p className=" text-gray-500 flex items-center">
              ⭐️ <span className="text-sm mr-2">({numberOfRatings})</span>{" "}
              <span className="text-rose-600">{averageRating.toFixed(1)}</span>
            </p>
            {/* Display number of ratings */}
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
                    className={`size-4 cursor-pointer ${
                      ratings > index ? "fill-blue-500" : "fill-white"
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

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="lightBlue"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
