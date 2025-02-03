import { ConfigProps } from "@/types/config";

const config = {
  appName: "African Real Estate",
  appDescription:
    "Experience the epitome of modern African real estate at African Real Estate Hub. Discover affordable housing solutions tailored to your needs, whether you're looking to buy or let. Explore our diverse portfolio showcasing the best of African creativity in architecture and design. Find your dream home with us today!",
  domainName: "african-realestate.com",

  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
