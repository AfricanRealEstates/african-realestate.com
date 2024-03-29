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
    ],
  },
};

// export default nextConfig;
module.exports = nextConfig;
