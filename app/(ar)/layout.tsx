import { RootDocument } from '@/components/site/RootDocument';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="ar">{children}</RootDocument>;
}
