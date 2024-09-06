// "use client";

// import { getRatings, saveRating, getUserRating } from "@/actions/rating-action";
// import { useSession } from "next-auth/react";
// import React, { FormEvent, useState, useEffect, Suspense } from "react";
// import { toast } from "sonner";

// interface FeedbackWidgetProps {
//   propertyId: string;
//   propertyOwnerId: string;
// }

// export default function FeedbackWidget({
//   propertyId,
//   propertyOwnerId,
// }: FeedbackWidgetProps) {
//   const [ratings, setRatings] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [averageRating, setAverageRating] = useState<number>(0);
//   const [numberOfRatings, setNumberOfRatings] = useState(0);
//   const [userHasRated, setUserHasRated] = useState(false);
//   const { data: session } = useSession();
//   const user = session?.user;

//   useEffect(() => {
//     async function fetchRatingData() {
//       const { averageRating, ratingsCount } = await getRatings(propertyId);
//       setAverageRating(averageRating);
//       setNumberOfRatings(ratingsCount);

//       if (user) {
//         const userRating = await getUserRating(user.id!, propertyId);
//         if (userRating) {
//           setUserHasRated(true);
//           setRatings(+userRating.ratings);
//         }
//       }
//     }
//     fetchRatingData();
//   }, [propertyId, submitted, user]);

//   const onSelectStar = (index: number) => {
//     setRatings(index + 1);
//   };

//   const onSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       toast.error("You must be logged in to submit a rating.");
//       return;
//     }

//     const ratingInfo = {
//       ratings,
//       propertyId,
//       userId: user.id,
//     };

//     try {
//       const response = await saveRating(ratingInfo);

//       if (response.message === "Rating saved successfully") {
//         setSubmitted(true);
//         toast.success("Thank you for your rating!");
//         const { averageRating, ratingsCount } = await getRatings(propertyId);
//         setAverageRating(averageRating);
//         setNumberOfRatings(ratingsCount);
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       toast.error("Failed to submit rating.");
//     }
//   };

//   const getRatingMessage = (rating: number) => {
//     if (rating > 4.5 && rating <= 5.0) return "💫️ Awesome Property";
//     if (rating >= 4.0 && rating <= 4.5) return "🤩️ Excellent Property";
//     if (rating >= 3.0 && rating < 4.0) return "🙂️ Perfect Property";
//     if (rating >= 2.0 && rating < 3.0) return "🫡️ Good Property";
//     if (rating >= 1.0 && rating < 2.0) return "🙂️ Okay Property";
//     return "";
//   };

//   return (
//     <>
//       {user?.id === propertyOwnerId ? (
//         <div className="space-y-2 h-full my-0.5 gap-2 flex flex-col">
//           {numberOfRatings > 0 ? (
//             <div className="flex space-y-2 flex-col text-blue-800 rounded-lg bg-gray-50 p-2 h-full">
//               <p className="text-blue-600 text-sm font-semibold">
//                 {getRatingMessage(averageRating)}
//               </p>
//               <div className="flex items-center">
//                 {[...Array(Math.floor(averageRating))].map((_, index) => (
//                   <StarIcon key={index} full />
//                 ))}
//                 {averageRating % 1 !== 0 && <StarIcon half />}
//                 {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
//                   <StarIcon key={index} />
//                 ))}
//                 <span className="text-sm ml-2">({numberOfRatings})</span>{" "}
//                 <span className="text-rose-500 ml-2">
//                   {averageRating.toFixed(1)}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <h3 className="text-blue-800 bg-blue-100 w-fit px-2 py-[1.5px] text-[12px] rounded-full">
//                 Property Not Rated Yet
//               </h3>
//               <div className="flex items-center gap-2">
//                 {[...Array(5)].map((_, index) => (
//                   <StarIcon key={index} className="size-5 fill-white" />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <h3 className="text-xs">✨️ Rate this property</h3>
//           <form onSubmit={onSubmit} className="flex flex-col">
//             <div className="flex flex-col items-center justify-between gap-4">
//               <div className="flex items-center gap-2">
//                 {[...Array(5)].map((_, index) => (
//                   <StarIcon
//                     key={index}
//                     full={ratings > index}
//                     className="size-4 cursor-pointer"
//                     onClick={() => onSelectStar(index)}
//                   />
//                 ))}
//               </div>
//               <button
//                 type="submit"
//                 className="w-full text-sm text-blue-800 rounded-lg bg-blue-100 hover:bg-blue-50 py-0.5 px-3 transition-all"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }

// function StarIcon({
//   full = false,
//   half = false,
//   className = "",
//   onClick,
// }: any) {
//   return (
//     <svg
//       onClick={onClick}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       className={className}
//       fill={full ? "gold" : half ? "url(#halfGradient)" : "none"}
//       stroke="gold"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <defs>
//         <linearGradient id="halfGradient">
//           <stop offset="50%" stopColor="gold" />
//           <stop offset="50%" stopColor="none" />
//         </linearGradient>
//       </defs>
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );
// }

"use client";

import { getRatings, saveRating, getUserRating } from "@/actions/rating-action";
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
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    async function fetchRatingData() {
      const { averageRating, ratingsCount } = await getRatings(propertyId);
      setAverageRating(averageRating);
      setNumberOfRatings(ratingsCount);

      if (user) {
        const userRating = await getUserRating(user.id!, propertyId);
        if (userRating) {
          setUserHasRated(true);
          setRatings(+userRating.ratings);
        }
      }
    }
    fetchRatingData();
  }, [propertyId, submitted, user]);

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
      {userHasRated && averageRating > 0 ? (
        <Suspense fallback={<p>Loading...</p>}>
          <div className="flex space-y-2 flex-col text-blue-800 rounded-lg bg-gray-50 p-2 h-full">
            <p className="text-blue-600 text-sm font-semibold">
              {getRatingMessage(averageRating)}
            </p>
            <p className="text-gray-500 flex items-center">
              ⭐️ <span className="text-sm mr-2">({numberOfRatings})</span>{" "}
              <span className="text-rose-500">{averageRating.toFixed(1)}</span>
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
                      ratings > index ? "fill-[#FFFF00]" : "fill-white"
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
  onClick,
}: any) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      fill={full ? "[#FFFF00]" : half ? "url(#halfGradient)" : "none"}
      stroke="gold"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
