import { initScheduler } from "./scheduler";

// Initialize the application
export function initializeApp() {
  // Initialize the scheduler for property expiration checks and emails
  initScheduler();

  // Other initialization code can go here
  console.log("Application initialized with email notification system");
}
