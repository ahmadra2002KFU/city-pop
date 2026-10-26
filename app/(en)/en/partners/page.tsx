import { pageMetadata } from '@/lib/page-metadata';
import { PartnersPage } from '@/components/pages/PartnersPage';

export const dynamic = 'force-static';
export const metadata = pageMetadata('partners', 'en');

export default function Page() {
  return <PartnersPage lang="en" />;
}
