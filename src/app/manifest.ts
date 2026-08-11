import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Stock247 Financial Market & Trading Telemetry',
    short_name: 'Stock247',
    description: 'Real-Time Market Insights, Stock Signals, Options Strategies, and High-Speed Trading Guides.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080D',
    theme_color: '#00D09C',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

