import { redirect } from 'next/navigation'

// De app opent standaard op de Dex-tab (Shiny Dex is de kern van de app).
export default function Home() {
  redirect('/dex')
}
