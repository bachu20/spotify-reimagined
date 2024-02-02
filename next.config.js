/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xozgjdnzgucrjyhenkgb.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
