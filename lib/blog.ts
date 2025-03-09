export function formatDate(date: string, includeRelative = false): string {
  const currentDate = new Date();
  const targetDate = new Date(date);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffInSeconds = (currentDate.getTime() - targetDate.getTime()) / 1000;

  let relativeTime: string;
  if (diffInSeconds < 60) {
    relativeTime = formatter.format(-Math.round(diffInSeconds), "second");
  } else if (diffInSeconds < 3600) {
    relativeTime = formatter.format(-Math.round(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    relativeTime = formatter.format(-Math.round(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    relativeTime = formatter.format(-Math.round(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    relativeTime = formatter.format(
      -Math.round(diffInSeconds / 2592000),
      "month"
    );
  } else {
    relativeTime = formatter.format(
      -Math.round(diffInSeconds / 31536000),
      "year"
    );
  }

  const fullDate = targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return includeRelative ? `${fullDate} (${relativeTime})` : fullDate;
}
