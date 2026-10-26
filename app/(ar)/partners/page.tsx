import { pageMetadata } from '@/lib/page-metadata';
import { PartnersPage } from '@/components/pages/PartnersPage';

export const dynamic = 'force-static';
export const metadata = pageMetadata('partners', 'ar');

export default function Page() {
  return <PartnersPage lang="ar" />;
}
