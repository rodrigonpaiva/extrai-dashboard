import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
      reactStrictMode: true,
        swcMinify: true,
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'extrai.ia',
              port: '',
              pathname: '/dashboard/**',
            },
          ],
        },
};

export default nextConfig;
