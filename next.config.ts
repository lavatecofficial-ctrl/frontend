import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimizaciones para builds más rápidos
  swcMinify: true,
  experimental: {
    // Usar caché de compilación
    turbo: {
      rules: {},
    },
  },
  // Suprimir warnings de hidratación causados por extensiones del navegador
  reactStrictMode: false,
};

export default nextConfig;
