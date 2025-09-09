import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Настройки для GitHub Pages
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/visa-map' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/visa-map/' : '',

  // Оптимизация изображений
  images: {
    unoptimized: true, // Для GitHub Pages
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Оптимизация пакетов
  experimental: {
    optimizePackageImports: ['react-icons', 'react-world-flags'],
    optimizeRouterScrolling: true,
  },

  // Оптимизация производительности
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Оптимизация сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
