import { pageMetadata } from '@/lib/page-metadata';
import { VisitorsPage } from '@/components/pages/VisitorsPage';

export const dynamic = 'force-static';
export const metadata = pageMetadata('visitors', 'en');

export default function Page() {
  return <VisitorsPage lang="en" />;
}
