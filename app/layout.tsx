import type { Metadata } from 'next';
import Script from 'next/script';
import '../site/styles.css';
export const metadata: Metadata = {
  title: 'Muhammad Usama — Graphic Designer & UI/UX Designer',
  description: 'An independent creative portfolio exploring brand identity, UI/UX, motion and digital campaigns. 20 design studies by Muhammad Usama.',
  openGraph: { title: 'Muhammad Usama — Visual Design Portfolio', description: 'Ideas into impact. Graphic design, branding, UI/UX and motion.' },
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
  return <html lang="en"><body>{children}<Script src="/projects-data.js" strategy="beforeInteractive"/><Script src="/site.js" strategy="afterInteractive"/><Script src="/webgl-orbit.js" strategy="lazyOnload"/></body></html>;
}
