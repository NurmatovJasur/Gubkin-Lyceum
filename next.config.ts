import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Локальные фотографии лицея — только современные форматы.
    formats: ['image/avif', 'image/webp'],
    // Ширины подобраны под реальные точки сетки сайта (карточки → полноэкранные кадры).
    deviceSizes: [375, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [160, 240, 320, 420, 560, 768],
    // 82 — карточки и портреты, 85 — hero и полноширинные кадры.
    qualities: [75, 82, 85]
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
