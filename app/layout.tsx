import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(
    'https://city-pop-experience.basic-rhino-0834.chatgpt.site',
  ),
  title: 'CITY POP | سيتي بوب — من الشاشة إلى الشارع',
  description:
    'اكتشف سيتي بوب، مدينة متنقلة تحتفي بالجمال وأسلوب الحياة. ست مناطق للتسوّق والمذاق والموسيقى واللعب. استكشف التجربة وصمّم زيارتك.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
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
