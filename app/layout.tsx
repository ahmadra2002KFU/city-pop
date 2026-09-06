import type { Metadata } from 'next';
import { assetPath } from '@/lib/asset-path';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      'https://city-pop-experience.arabaiah.chatgpt.site',
  ),
  title: 'CITY POP | سيتي بوب — من الشاشة إلى الشارع',
  description:
    'اكتشف سيتي بوب، مدينة متنقلة تحتفي بالجمال وأسلوب الحياة. ست مناطق للتسوّق والمذاق والموسيقى واللعب. استكشف التجربة وصمّم زيارتك.',
  robots: { index: false, follow: false },
  icons: { icon: assetPath('/favicon.svg') },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
