/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "4muw4qkgpimyciou.public.blob.vercel-storage.com",
      },
      {
        hostname: "firebasestorage.googleapis.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
};
export default nextConfig;
