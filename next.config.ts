import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images:{
    domains:['lh3.googleusercontent.com',"upload.wikimedia.org"]
  }
};

export default nextConfig;
