import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // Allow images from Supabase Storage (used for CCTV/evidence uploads)
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "*.jiobase.com",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },
    // Silence noisy but harmless package warnings from AI SDK / Supabase
    serverExternalPackages: [],
}

export default nextConfig
