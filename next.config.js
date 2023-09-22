/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "hpm58d6xookcs2il.public.blob.vercel-storage.com"],
    deviceSizes: [576, 768, 992, 1200, 1400], //Bootsraps sizes
  },
};

module.exports = nextConfig;
