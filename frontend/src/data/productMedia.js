// Real photos and videos of each product, keyed by the product's id in productCatalog.js.
// The first photo is the product's main image (cards, menus, page hero).
//
// Photos: /public/images/products/<area>/<product>/<product>-NN.webp (1600px) with a small
// -NN-sm.webp copy for grids. place = where the photo was taken; noteKey = optional caption (i18n/media.js).
// Videos: /public/videos/<id>.mp4 with a <id>.webp poster frame; titleKey in i18n/media.js.
export const PRODUCT_PHOTOS = {
  'dryer-6': [
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-01.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-02.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-02-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-03.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-03-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-04.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-04-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-05.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-05-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-6/dryer-6-06.webp', thumb: '/images/products/solar-dryer/dryer-6/dryer-6-06-sm.webp', w: 1205, h: 1600 },
  ],
  'dryer-12': [
    { src: '/images/products/solar-dryer/dryer-12/dryer-12-01.webp', thumb: '/images/products/solar-dryer/dryer-12/dryer-12-01-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/dryer-12/dryer-12-02.webp', thumb: '/images/products/solar-dryer/dryer-12/dryer-12-02-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/dryer-12/dryer-12-03.webp', thumb: '/images/products/solar-dryer/dryer-12/dryer-12-03-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/dryer-12/dryer-12-04.webp', thumb: '/images/products/solar-dryer/dryer-12/dryer-12-04-sm.webp', w: 716, h: 1600 },
  ],
  'dryer-50': [
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-01.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-02.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-02-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-03.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-03-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-04.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-04-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-05.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-05-sm.webp', w: 1600, h: 900 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-06.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-06-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-07.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-07-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-08.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-08-sm.webp', w: 1600, h: 722 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-09.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-09-sm.webp', w: 722, h: 1600 },
    { src: '/images/products/solar-dryer/dryer-50/dryer-50-10.webp', thumb: '/images/products/solar-dryer/dryer-50/dryer-50-10-sm.webp', w: 1600, h: 1205 },
  ],
  'tunnel-d1210-150': [
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-01.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-02.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-02-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-03.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-03-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-04.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-04-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-05.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-05-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-06.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-06-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-07.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-150/tunnel-d1210-150-07-sm.webp', w: 1600, h: 1205 },
  ],
  'tunnel-d1210-300': [
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-01.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-02.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-02-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-03.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-03-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-04.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-04-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-05.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-05-sm.webp', w: 1600, h: 722 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-06.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-06-sm.webp', w: 1600, h: 722 },
    { src: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-07.webp', thumb: '/images/products/solar-dryer/tunnel-d1210-300/tunnel-d1210-300-07-sm.webp', w: 1600, h: 722 },
  ],
  'tunnel-h2008-250': [
    { src: '/images/products/solar-dryer/tunnel-h2008-250/tunnel-h2008-250-01.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-250/tunnel-h2008-250-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-dryer/tunnel-h2008-250/tunnel-h2008-250-02.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-250/tunnel-h2008-250-02-sm.webp', w: 1600, h: 1205 },
  ],
  'tunnel-h2008-1000': [
    { src: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-01.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-01-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-02.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-02-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-03.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-03-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-04.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-04-sm.webp', w: 1600, h: 711 },
    { src: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-05.webp', thumb: '/images/products/solar-dryer/tunnel-h2008-1000/tunnel-h2008-1000-05-sm.webp', w: 1600, h: 711 },
  ],
  'tunnel-p1709-200': [
    { src: '/images/products/solar-dryer/tunnel-p1709-200/tunnel-p1709-200-01.webp', thumb: '/images/products/solar-dryer/tunnel-p1709-200/tunnel-p1709-200-01-sm.webp', w: 1600, h: 1205 },
  ],
  'parabolic-trough': [
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-01.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-01-sm.webp', w: 1600, h: 1200 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-02.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-02-sm.webp', w: 1600, h: 1200 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-03.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-03-sm.webp', w: 1600, h: 1200, place: "Pachamalai Hills, Trichy, Tamil Nadu", noteKey: "media_ptcVillage" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-04.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-04-sm.webp', w: 1600, h: 1200, place: "IIT Bhubaneswar, Odisha", noteKey: "media_ptcStudy" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-05.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-05-sm.webp', w: 1080, h: 1439, place: "IIT Bhubaneswar, Odisha", noteKey: "media_rndSetup" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-06.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-06-sm.webp', w: 1600, h: 1200, place: "Gandhigram Rural Institute, Dindigul, Tamil Nadu", noteKey: "media_ptcStudy" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-07.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-07-sm.webp', w: 1600, h: 1005, place: "Sree Sankara College, Angamaly, Kerala", noteKey: "media_ptcStudy" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-08.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-08-sm.webp', w: 1600, h: 722, place: "Manipal University, Karnataka", noteKey: "media_rndSetup" },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-09.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-09-sm.webp', w: 1600, h: 722 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-10.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-10-sm.webp', w: 1600, h: 1200 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-11.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-11-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-12.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-12-sm.webp', w: 1600, h: 1200 },
    { src: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-13.webp', thumb: '/images/products/solar-thermal/parabolic-trough/parabolic-trough-13-sm.webp', w: 1600, h: 1200 },
  ],
  'scheffler-dish': [
    { src: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-01.webp', thumb: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-01-sm.webp', w: 1600, h: 1080, place: "Indo-MIM, Bengaluru, Karnataka" },
    { src: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-02.webp', thumb: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-02-sm.webp', w: 1600, h: 1200, place: "SRM Institute of Science and Technology, Chennai" },
    { src: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-03.webp', thumb: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-03-sm.webp', w: 1600, h: 1200, place: "SRM Institute of Science and Technology, Chennai" },
    { src: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-04.webp', thumb: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-04-sm.webp', w: 1200, h: 1600, place: "SRM Institute of Science and Technology, Chennai" },
    { src: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-05.webp', thumb: '/images/products/solar-thermal/scheffler-dish/scheffler-dish-05-sm.webp', w: 1600, h: 757 },
  ],
  'solar-water-heater': [
    { src: '/images/products/solar-water-heater/solar-water-heater/solar-water-heater-01.webp', thumb: '/images/products/solar-water-heater/solar-water-heater/solar-water-heater-01-sm.webp', w: 1205, h: 1600 },
  ],
  'pv-bending-test': [
    { src: '/images/products/research-and-development/pv-bending-test/pv-bending-test-01.webp', thumb: '/images/products/research-and-development/pv-bending-test/pv-bending-test-01-sm.webp', w: 1600, h: 1205 },
    { src: '/images/products/research-and-development/pv-bending-test/pv-bending-test-02.webp', thumb: '/images/products/research-and-development/pv-bending-test/pv-bending-test-02-sm.webp', w: 1600, h: 899 },
  ],
  'pv-visual-inspection': [
    { src: '/images/products/research-and-development/pv-visual-inspection/pv-visual-inspection-01.webp', thumb: '/images/products/research-and-development/pv-visual-inspection/pv-visual-inspection-01-sm.webp', w: 1600, h: 1067 },
    { src: '/images/products/research-and-development/pv-visual-inspection/pv-visual-inspection-02.webp', thumb: '/images/products/research-and-development/pv-visual-inspection/pv-visual-inspection-02-sm.webp', w: 1600, h: 1468 },
  ],
  'shadow-dial': [
    { src: '/images/products/research-and-development/shadow-dial/shadow-dial-01.webp', thumb: '/images/products/research-and-development/shadow-dial/shadow-dial-01-sm.webp', w: 1579, h: 1600 },
    { src: '/images/products/research-and-development/shadow-dial/shadow-dial-02.webp', thumb: '/images/products/research-and-development/shadow-dial/shadow-dial-02-sm.webp', w: 1600, h: 1600 },
  ],
  'log-splitter': [
    { src: '/images/products/research-and-development/log-splitter/log-splitter-01.webp', thumb: '/images/products/research-and-development/log-splitter/log-splitter-01-sm.webp', w: 1600, h: 1119 },
    { src: '/images/products/research-and-development/log-splitter/log-splitter-02.webp', thumb: '/images/products/research-and-development/log-splitter/log-splitter-02-sm.webp', w: 1600, h: 976 },
    { src: '/images/products/research-and-development/log-splitter/log-splitter-03.webp', thumb: '/images/products/research-and-development/log-splitter/log-splitter-03-sm.webp', w: 758, h: 1600 },
  ],
};

export const PRODUCT_VIDEOS = [
  { id: 'chilli-drying', product: 'solar-dryer', titleKey: 'media_vidChilli', src: '/videos/chilli-drying.mp4', poster: '/videos/chilli-drying.webp', w: 480, h: 854, duration: 40 },
  { id: 'rose-petal-drying', product: 'tunnel-d1210-300', titleKey: 'media_vidRose', src: '/videos/rose-petal-drying.mp4', poster: '/videos/rose-petal-drying.webp', w: 1280, h: 720, duration: 24 },
  { id: 'tunnel-dryer-walkaround', product: 'tunnel-d1210-300', titleKey: 'media_vidWalk', src: '/videos/tunnel-dryer-walkaround.mp4', poster: '/videos/tunnel-dryer-walkaround.webp', w: 1280, h: 720, duration: 20 },
];
