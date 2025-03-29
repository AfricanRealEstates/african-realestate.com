import cron from "node-cron";
import {
  checkExpiredProperties,
  checkExpiringProperties,
} from "./property-expiration";

let cronJobsInitialized = false;

export function initCronJobs() {
  // Prevent multiple initializations
  if (cronJobsInitialized) {
    console.log("Cron jobs already initialized, skipping...");
    return;
  }

  console.log("Initializing property expiration cron jobs...");

  // Check for properties that will expire soon - run daily at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log(
      "Running scheduled task: checking properties that will expire soon"
    );
    try {
      const result = await checkExpiringProperties();
      console.log(`Sent ${result.emailsSent} expiration reminder emails`);
    } catch (error) {
      console.error("Error checking expiring properties:", error);
    }
  });

  // Check for properties that have expired - run daily at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Running scheduled task: checking expired properties");
    try {
      const result = await checkExpiredProperties();
      console.log(
        `Deactivated ${result.deactivated} expired properties and sent ${result.emailsSent} emails`
      );
    } catch (error) {
      console.error("Error checking expired properties:", error);
    }
  });

  cronJobsInitialized = true;
  console.log("Property expiration cron jobs initialized successfully");
}
