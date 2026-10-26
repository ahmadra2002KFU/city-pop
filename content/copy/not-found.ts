/**
 * Copy for the 404 page. GitHub Pages serves one 404.html for every missing URL,
 * in either language, so the page shows both languages side by side.
 */
export const notFoundCopy = {
  documentTitle: 'الصفحة غير موجودة · Page not found | CITY POP',
  code: '404',
  ar: {
    title: 'هذه الصفحة غير موجودة',
    text: 'ربما تغيّر الرابط أو كُتب بشكل خاطئ. اختر وجهتك من هنا.',
    home: 'الصفحة الرئيسية',
    partners: 'صفحة الشركاء',
  },
  en: {
    title: 'This page does not exist',
    text: 'The link may have changed or been mistyped. Pick where to go next.',
    home: 'Home page',
    partners: 'Partners page',
  },
} as const;
