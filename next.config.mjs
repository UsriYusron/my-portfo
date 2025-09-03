/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: ["https://3000-firebase-my-portfo-1756878386882.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev"],
  },
};

export default nextConfig;
