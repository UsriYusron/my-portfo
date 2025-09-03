// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.imgur.com"], // ✅ izinkan load gambar dari Imgur
  },
};

export default nextConfig;
