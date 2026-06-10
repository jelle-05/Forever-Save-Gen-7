import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Forever Save',
    short_name: 'Forever Save',
    description: 'Volg je Pokémon Ultra Sun/Ultra Moon "forever save".',
    id: '/',
    start_url: '/',
    scope: '/',
    lang: 'nl',
    dir: 'ltr',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
