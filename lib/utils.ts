import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeWords(sentence: string): string {
  if (typeof sentence !== 'string') {
    return '';
  }

  return sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// export function formatRelativeDate(from: Date) {
//   const currentDate = new Date();
//   if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
//     return formatDistanceToNowStrict(from, { addSuffix: true });
//   } else {
//     if (currentDate.getFullYear() === from.getFullYear()) {
//       return formatDate(from, "MMM d");
//     } else {
//       return formatDate(from, "MMM d, yyyy");
//     }
//   }
// }

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - from.getTime();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  if (timeDifference < oneDayInMilliseconds) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else if (timeDifference < 30 * oneDayInMilliseconds) { // If within a month
    return formatDate(from, "MMMM yyyy"); // Month Year format
  } else if (currentDate.getFullYear() === from.getFullYear()) {
    return formatDate(from, "MMM d");
  } else {
    return formatDate(from, "MMM d, yyyy");
  }
}

export function formatBlogDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Calculates the percentage savings.
 * @param {number} basePrice - The original price of the item.
 * @param {number} leastPrice - The discounted or least price of the item.
 * @returns {string} - A string representing the percentage savings rounded to two decimal places or an empty string if savings are zero.
 */
export function calculatePercentageSavings(basePrice: number, leastPrice: number): string {
  // Ensure basePrice is greater than zero to avoid division by zero
  if (basePrice <= 0) {
    throw new Error("Base price must be greater than zero.");
  }

  // Calculate percentage savings
  const percentageSavings = ((basePrice - leastPrice) / basePrice) * 100;

  // Return an empty string if the percentage savings is effectively zero
  return percentageSavings <= 0.0001 ? '' : percentageSavings.toFixed(2);
}


// Blog fetcher
export const fetchUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://modernsite1.vercel.app/api";

type ResponseData = {
  category: string;
  title: string;
  slug: string;
  summary: string;
}[];

export const fetcher = (
  ...args: Parameters<typeof fetch>
): Promise<ResponseData> => fetch(...args).then((res) => res.json());