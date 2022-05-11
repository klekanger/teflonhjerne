import { VitePWA } from 'vite-plugin-pwa';
export default {
  plugins: [
    VitePWA({
      manifest: {
        name: 'Teflonhjerne - memory game',
        short_name: 'Teflonhjerne',
        start_url: '/',
        scope: '/',
        background_color: '#ffffff',
        theme_color: '#f6b445',
        display: 'standalone',
        icons: [
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: 'icon-maskable.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        description:
          'I Teflonhjerne er det om å gjøre å huske hvilke figurer som befinner seg i hver rute. Det er mulig å klare spillet på 8 forsøk, men da må du ha vanvittig med flaks - og vi vil heller anbefale Lotto.',
        screenshots: [
          {
            src: 'screenshot.webp',
            sizes: '611x814',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
};
