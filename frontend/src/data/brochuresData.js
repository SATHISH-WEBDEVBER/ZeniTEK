// Official ZeniTEK PDF brochures (footer list + /brochures/:brochureId reader pages)
export const brochures = [
  {
    id: 'solar-dryer',
    title: 'Solar Dryer Technical Brochure',
    subtitle: 'Commercial Polyhouse (10 Pages)',
    url: '/brochures/zenitek-solar-dryer-brochure.pdf',
    downloadName: 'ZeniTEK-Commercial-Solar-Dryer-Brochure.pdf',
    size: '7.1 MB',
    pageCount: 10,
    pages: Array.from({ length: 10 }, (_, i) => `/brochures/pages/solar-dryer/page-${i + 1}.jpg`),
    badge: 'Commercial',
    badgeColor: 'bg-[#F0F4FD] text-[#123B92] border-[#123B92]/30'
  },
  {
    id: 'household-box',
    title: 'Household Solar Box Dryer',
    subtitle: 'Sundry Mini (Kitchen & Balcony)',
    url: '/brochures/zenitek-household-box-dryer-brochure.pdf',
    downloadName: 'ZeniTEK-Household-Solar-Box-Dryer-Brochure.pdf',
    size: '1.0 MB',
    pageCount: 3,
    pages: Array.from({ length: 3 }, (_, i) => `/brochures/pages/household-box/page-${i + 1}.jpg`),
    badge: 'Domestic',
    badgeColor: 'bg-[#23AC39]/10 text-[#1A822B] border-[#23AC39]/30'
  },
  {
    id: 'entrepreneur-box',
    title: 'Entrepreneur Box Dryer',
    subtitle: 'Commercial 4 & 8-Tray SS304 Model',
    url: '/brochures/zenitek-entrepreneur-box-dryer-brochure.pdf',
    downloadName: 'ZeniTEK-Entrepreneur-Solar-Box-Dryer-Brochure.pdf',
    size: '1.2 MB',
    pageCount: 4,
    pages: Array.from({ length: 4 }, (_, i) => `/brochures/pages/entrepreneur-box/page-${i + 1}.jpg`),
    badge: 'Business',
    badgeColor: 'bg-[#002DC2]/10 text-[#002DC2] border-[#002DC2]/30'
  }
];
