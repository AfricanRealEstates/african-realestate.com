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

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
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
