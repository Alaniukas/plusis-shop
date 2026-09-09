import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone / LAN testing against this PC
  allowedDevOrigins: [
    "192.168.1.142",
    "192.168.1.184",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;