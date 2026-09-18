import express from 'express';
import Project from '../models/Project.js';
import Review from '../models/Review.js';

const router = express.Router();

export const initialProjects = [
  {
    "title": "Komarapalayam ZeniTEK Innovation Centre",
    "locationName": "Komarapalayam, Namakkal (ZeniTEK Center), Tamil Nadu",
    "latitude": 11.190583,
    "longitude": 77.856306,
    "cropDrying": "Multi-Crop Thermal Research & Training",
    "dryerType": "D1210 - 150 Incubation Dryer",
    "capacity": "150 kg Batch Research Unit",
    "imageUrl": "/projects/project-24.jpg",
    "description": "Active operational solar polyhouse at ZeniTEK Incubation Center, SSM College of Engineering, Komarapalayam for continuous drying analytics and farmer training."
  },
  {
    "title": "Sathyamangalam Agro Solar Dryer",
    "locationName": "Sathyamangalam, Erode, Tamil Nadu",
    "latitude": 11.446972,
    "longitude": 77.003389,
    "cropDrying": "Turmeric, Grains & Spices",
    "dryerType": "SOLDRY 1208 Tunnel Dryer",
    "capacity": "250 kg Batch",
    "imageUrl": "/projects/project-03.jpg",
    "description": "Walk-in solar thermal dryer installation in Sathyamangalam belt for commercial turmeric and spice preservation."
  },
  {
    "title": "Vazhapady Solar Food Plant (2024)",
    "locationName": "Vazhapady, Salem, Tamil Nadu",
    "latitude": 11.583278,
    "longitude": 78.341389,
    "cropDrying": "Maize, Paddy & Turmeric",
    "dryerType": "1209 - 150 Solar Dryer",
    "capacity": "150 kg Batch Unit",
    "imageUrl": "/projects/project-03.jpg",
    "description": "Household and farm solar dryer in Vazhapady, Salem district enabling smallholders to dehydrate turmeric, paddy, and grains with zero electricity cost."
  },
  {
    "title": "Kallanatham Solar Dryer Plant",
    "locationName": "Chinnasalem, Kallakurichi, Tamil Nadu",
    "latitude": 11.633583,
    "longitude": 78.800833,
    "cropDrying": "Maize, Paddy & Multi-Crops",
    "dryerType": "1208 - 150 Polyhouse Dryer",
    "capacity": "150 kg Batch Setup",
    "imageUrl": "/projects/project-02.jpg",
    "description": "1208 - 150 household solar polyhouse installed in Chinnasalem, Kallakurichi for rapid, rainproof food drying."
  },
  {
    "title": "Kallakurichi Commercial Solar Dryer",
    "locationName": "Chinnasalem, Kallakurichi, Tamil Nadu",
    "latitude": 11.663611,
    "longitude": 78.806667,
    "cropDrying": "Chillies, Spices & Horticulture",
    "dryerType": "SOLDRY 1210 Walk-In",
    "capacity": "300 kg Batch",
    "imageUrl": "/projects/project-02.jpg",
    "description": "Commercial walk-in polyhouse solar dryer in Kallakurichi protecting chilli harvests from rain spoilage and mold contamination."
  },
  {
    "title": "Kalpalayam Moringa Leaf Dehydrator",
    "locationName": "Musiri / Trichy, Tamil Nadu",
    "latitude": 10.967139,
    "longitude": 78.788,
    "cropDrying": "Moringa Leaves for Value Addition",
    "dryerType": "D1210 - 100 Solar Polyhouse",
    "capacity": "100 kg Batch Setup",
    "imageUrl": "/projects/project-12.jpg",
    "description": "D1210 - 100 compact polyhouse solar dryer installed near SRM University, Trichy for commercial export-grade green moringa powder production."
  },
  {
    "title": "Pollachi Copra Solar Tunnel Dryer",
    "locationName": "Pollachi, Coimbatore, Tamil Nadu",
    "latitude": 10.700472,
    "longitude": 77.04375,
    "cropDrying": "Coconut / Grade-1 White Copra",
    "dryerType": "1208 - 300 Walk-In Tunnel",
    "capacity": "300 kg Batch / 500 Nuts Daily",
    "imageUrl": "/projects/project-04.jpg",
    "description": "High-capacity walk-in polyhouse solar tunnel dryer in Pollachi coconut belt yielding 100% Grade-1 White Copra with zero sulfur or smoke contamination."
  },
  {
    "title": "Kotagiri Banagudi Tribal SHG Dryer",
    "locationName": "Kotagiri, Nilgiris, Tamil Nadu",
    "latitude": 11.391889,
    "longitude": 76.866389,
    "cropDrying": "Wild Amla, Jackfruit & Hill Grains",
    "dryerType": "D1210 - 150 Hill Polyhouse",
    "capacity": "150 kg Batch Unit",
    "imageUrl": "/projects/project-10.jpg",
    "description": "D1210 - 150 solar polyhouse empowering tribal women's self-help groups in Kotagiri, Nilgiris to process organic forest amla and jackfruit chips."
  },
  {
    "title": "Kallakurichi Agro Processing Dryer",
    "locationName": "Chinnasalem, Kallakurichi, Tamil Nadu",
    "latitude": 11.670861,
    "longitude": 78.780694,
    "cropDrying": "Spices, Herbs & Horticulture",
    "dryerType": "Commercial Polyhouse Tunnel",
    "capacity": "250 kg Batch Setup",
    "imageUrl": "/projects/project-02.jpg",
    "description": "Rain-proof greenhouse solar thermal installation providing continuous clean dehydration for regional farmers."
  },
  {
    "title": "Mulbagal Industrial Tiered Solar Dryer",
    "locationName": "Mulbagal, Kolar, Karnataka",
    "latitude": 13.231972,
    "longitude": 78.503194,
    "cropDrying": "Tomatoes, Herbal Leaves & Vegetables",
    "dryerType": "D1210 - 450 Multi-Tier Walk-In",
    "capacity": "450 kg Large Multi-Tier Batch",
    "imageUrl": "/projects/project-06.jpg",
    "description": "Large D1210 - 450 walk-in solar tunnel dryer with interior tiered stainless steel drying racks in Mulbagal, Karnataka for commercial tomato dehydration."
  },
  {
    "title": "Chikkaballapur Horticulture Dryer",
    "locationName": "Chikkaballapur, Karnataka",
    "latitude": 13.457389,
    "longitude": 77.7645,
    "cropDrying": "Moringa Leaves & Horticulture Produce",
    "dryerType": "D1210 - 300 Polyhouse",
    "capacity": "300 kg Batch Unit",
    "imageUrl": "/projects/project-05.jpg",
    "description": "D1210 - 300 commercial solar dryer installed in Chikkaballapur, Karnataka for high-retention moringa leaf drying and export value addition."
  },
  {
    "title": "Sirsi Areca Nut Solar Dryer",
    "locationName": "Sirsi, Uttara Kannada, Karnataka",
    "latitude": 14.650806,
    "longitude": 74.770667,
    "cropDrying": "Areca Nut / Betel Nut",
    "dryerType": "D1210 - 300 Walk-In",
    "capacity": "300 kg Batch Setup",
    "imageUrl": "/projects/project-07.jpg",
    "description": "D1210 - 300 solar thermal polyhouse installation in Sirsi, Uttara Kannada for rapid, mold-free areca nut processing during humid monsoon season."
  },
  {
    "title": "Haveri Farm Business Solar Dryer",
    "locationName": "Haveri, Karnataka",
    "latitude": 14.743,
    "longitude": 75.542306,
    "cropDrying": "Moringa Leaves & Agricultural Crops",
    "dryerType": "D1210 - 300 Polyhouse",
    "capacity": "300 kg Batch Unit",
    "imageUrl": "/projects/project-08.jpg",
    "description": "Farm business D1210 - 300 solar installation in Haveri, Karnataka delivering clean, dust-free dehydration for moringa leaves and local horticulture crops."
  },
  {
    "title": "Lakhanpuri Custard Apple Solar Plant",
    "locationName": "Lakhanpuri, Kanker, Chhattisgarh",
    "latitude": 20.392861,
    "longitude": 81.426583,
    "cropDrying": "Custard Apple Skin & Seeds",
    "dryerType": "HUT810 - 200 Commercial Dryer",
    "capacity": "200 kg Batch Setup",
    "imageUrl": "/projects/project-01.jpg",
    "description": "HUT810 - 200 commercial solar dryer installed in Lakhanpuri, Kanker district, Chhattisgarh for processing custard apple skin and seeds for agro-biomass."
  },
  {
    "title": "Attur Spice & Tapioca Dryer",
    "locationName": "Vazhapady, Salem, Tamil Nadu",
    "latitude": 11.653194,
    "longitude": 78.400667,
    "cropDrying": "Tapioca, Pepper & Turmeric",
    "dryerType": "SOLDRY 1210 Polyhouse",
    "capacity": "250 kg Batch Unit",
    "imageUrl": "/projects/project-09.jpg",
    "description": "Solar thermal drying unit in Attur, Salem district for tapioca and spice processing, reducing drying time from 6 days to 2 days."
  },
  {
    "title": "Chengalpattu Organic Food Dryer",
    "locationName": "Chengalpattu, Tamil Nadu",
    "latitude": 12.821444,
    "longitude": 80.044528,
    "cropDrying": "Herbal Powders, Vegetables & Greens",
    "dryerType": "Polyhouse Solar Dehydrator",
    "capacity": "200 kg Batch",
    "imageUrl": "/projects/project-12.jpg",
    "description": "Clean hygienic solar dehydration unit serving organic farmers cooperative in Chengalpattu district."
  },
  {
    "title": "Hoskote Solar Horticulture Unit",
    "locationName": "Hoskote, Bengaluru, Karnataka",
    "latitude": 13.118611,
    "longitude": 77.825528,
    "cropDrying": "Vegetables, Flowers & Herbs",
    "dryerType": "SOLDRY 1210 Walk-In",
    "capacity": "250 kg Batch Setup",
    "imageUrl": "/projects/project-05.jpg",
    "description": "Hoskote installation near Bengaluru supporting peri-urban vegetable and medicinal plant dehydration."
  },
  {
    "title": "Bhubaneswar Coastal Agro Solar Dryer",
    "locationName": "Khordha / Bhubaneswar, Odisha",
    "latitude": 20.142444,
    "longitude": 85.676167,
    "cropDrying": "Ginger, Turmeric & Marine Catch",
    "dryerType": "Hybrid Solar Polyhouse",
    "capacity": "300 kg Batch",
    "imageUrl": "/projects/project-19.jpg",
    "description": "Odisha installation serving farmer collectives for hygienic ginger, turmeric, and dried produce value addition."
  },
  {
    "title": "Chinnalapatti Herbal & Grape Dryer",
    "locationName": "Chinnalapatti, Dindigul, Tamil Nadu",
    "latitude": 10.276889,
    "longitude": 77.936806,
    "cropDrying": "Oil Seeds, Vegetables, Herbs & Grapes",
    "dryerType": "H2008 - 250 Solar Tunnel",
    "capacity": "250 kg Batch Setup",
    "imageUrl": "/projects/project-14.jpg",
    "description": "H2008 - 250 commercial polyhouse dryer in Kalikkampatti, Dindigul district processing oil seeds, grapes, vegetables, and medicinal herbs."
  },
  {
    "title": "Angamaly Spices Solar Polyhouse",
    "locationName": "Angamaly, Ernakulam, Kerala",
    "latitude": 10.179278,
    "longitude": 76.429583,
    "cropDrying": "Black Pepper, Cardamom & Nutmeg",
    "dryerType": "High-Humidity Solar Dryer",
    "capacity": "250 kg Batch Setup",
    "imageUrl": "/projects/project-07.jpg",
    "description": "Kerala spice corridor installation in Angamaly preserving 100% natural essential oils and volatile compounds in black pepper and nutmeg."
  },
  {
    "title": "Bavla Seed & Agro Solar Dryer",
    "locationName": "Bavla, Ahmedabad, Gujarat",
    "latitude": 22.872389,
    "longitude": 72.397333,
    "cropDrying": "Cumin, Fennel & Agricultural Seeds",
    "dryerType": "High-Volume Solar Tunnel",
    "capacity": "400 kg Batch",
    "imageUrl": "/projects/project-14.jpg",
    "description": "Gujarat agricultural installation in Bavla processing seed spices with clean sun-powered moisture extraction."
  },
  {
    "title": "Thuraiyur Onion & Banana Solar Plant",
    "locationName": "Thuraiyur, Trichy, Tamil Nadu",
    "latitude": 11.286194,
    "longitude": 78.587444,
    "cropDrying": "Shallots, Banana Chips & Herbs",
    "dryerType": "SOLDRY 1210 Tunnel",
    "capacity": "200 kg Batch",
    "imageUrl": "/projects/project-12.jpg",
    "description": "Trichy district solar dryer empowering rural farmers with commercial dehydration of shallots and bananas."
  },
  {
    "title": "Nagapattinam Hygienic Marine Dryer",
    "locationName": "Nagapattinam Coast, Tamil Nadu",
    "latitude": 10.821639,
    "longitude": 79.829528,
    "cropDrying": "Salted Fish & Coastal Seafood",
    "dryerType": "Sealed Coastal Solar Dryer",
    "capacity": "300 kg Marine Catch",
    "imageUrl": "/projects/project-20.jpg",
    "description": "Sealed fly-free coastal solar dryer protecting fishermen's marine catch from sand, flies, and rain damage."
  },
  {
    "title": "Dindigul Horticulture Solar Dryer",
    "locationName": "Chinnalapatti, Dindigul, Tamil Nadu",
    "latitude": 10.298278,
    "longitude": 77.927028,
    "cropDrying": "Vegetables, Flowers & Spices",
    "dryerType": "H2008 - 250 Commercial Unit",
    "capacity": "250 kg Batch Setup",
    "imageUrl": "/projects/project-14.jpg",
    "description": "Dindigul district solar greenhouse dryer serving local horticulture cooperatives."
  },
  {
    "title": "Perurani Coastal Marine Solar Dryer",
    "locationName": "Perurani, Thoothukudi, Tamil Nadu",
    "latitude": 8.762278,
    "longitude": 78.0095,
    "cropDrying": "Marine Fish & Salted Seafood",
    "dryerType": "H2008 - 1000 Industrial Dryer",
    "capacity": "1,000 kg Batch Industrial Unit",
    "imageUrl": "/projects/project-20.jpg",
    "description": "Massive H2008 - 1000 industrial hygienic seafood dryer in Perurani, Thoothukudi coastal belt for clean, fly-free, 100% solar dried fish production."
  },
  {
    "title": "Sailulak Mountain Solar Polyhouse",
    "locationName": "Sailulak, Mizoram, Mizoram",
    "latitude": 23.118694,
    "longitude": 93.145972,
    "cropDrying": "Bird's Eye Chilli, Ginger & Turmeric",
    "dryerType": "D1210 - 300 High-Elevation Unit",
    "capacity": "300 kg Batch Setup",
    "imageUrl": "/projects/project-21.jpg",
    "description": "D1210 - 300 high-elevation solar polyhouse in Sailulak, Mizoram preserving high curcumin turmeric, bird's eye chilli, and organic ginger."
  },
  {
    "title": "Kusumdhara Floral Solar Dryer",
    "locationName": "Kusumdhara, Nagpur, Maharashtra",
    "latitude": 21.429278,
    "longitude": 79.0995,
    "cropDrying": "Hibiscus, Butterfly Pea & Edible Flowers",
    "dryerType": "D1210 - 150 Solar Dehydrator",
    "capacity": "150 kg Batch Setup",
    "imageUrl": "/projects/project-15.jpg",
    "description": "D1210 - 150 solar floral dryer in Kusumdhara, Nagpur, Maharashtra preserving vibrant natural colors and petals in hibiscus and butterfly pea."
  },
  {
    "title": "Raichur Commercial Solar Dryer",
    "locationName": "Raichur, Karnataka",
    "latitude": 16.186722,
    "longitude": 77.379083,
    "cropDrying": "Red Chillies & Regional Field Crops",
    "dryerType": "P1709 - 200 Polyhouse",
    "capacity": "200 kg Batch Setup",
    "imageUrl": "/projects/project-18.jpg",
    "description": "P1709 - 200 solar polyhouse in Raichur, Karnataka for multi-crop commercial drying with high thermal efficiency."
  },
  {
    "title": "Manchenahalli Raisin & Seed Dryer",
    "locationName": "Manchenahalli, Chikkaballapur, Karnataka",
    "latitude": 13.497861,
    "longitude": 77.583833,
    "cropDrying": "Oil Seeds, Grapes & Multiple Crops",
    "dryerType": "D1210 - 150 Solar Polyhouse",
    "capacity": "150 kg Batch Setup",
    "imageUrl": "/projects/project-17.jpg",
    "description": "D1210 - 150 solar dryer in Manchenahalli, Chikkaballapur, Karnataka for high-grade raisin drying and local oilseed processing."
  },
  {
    "title": "Sakkanahalli Mushroom & Nut Dryer",
    "locationName": "Sakkanahalli, Bangarapet, Karnataka",
    "latitude": 12.945333,
    "longitude": 78.195528,
    "cropDrying": "Mushroom, Areca Nut, Copra & Amla",
    "dryerType": "D1210 - 300 Walk-In",
    "capacity": "300 kg Batch Setup",
    "imageUrl": "/projects/project-22.jpg",
    "description": "D1210 - 300 commercial solar dryer in Sakkanahalli, Bangarapet, Karnataka designed for high-value mushroom, areca nut, and copra drying."
  },
  {
    "title": "Kadambur Hill Forest Produce Dryer",
    "locationName": "Kadambur, Sathyamangalam, Tamil Nadu",
    "latitude": 11.623361,
    "longitude": 77.333972,
    "cropDrying": "Amla, Jackfruit, Grains & Forest Harvest",
    "dryerType": "D1210 - 300 Hill Polyhouse",
    "capacity": "300 kg Batch Setup",
    "imageUrl": "/projects/project-16.jpg",
    "description": "D1210 - 300 hill-region solar dryer in Kadambur, Sathyamangalam hills supporting tribal women SHGs in value-adding wild forest produce."
  },
  {
    "title": "Gohpur Industrial Solar Dryer Plant",
    "locationName": "Kaobo Centre, Gohpur, Assam",
    "latitude": 26.8833,
    "longitude": 93.6333,
    "cropDrying": "Naga Chilli, Specialty Tea & Spices",
    "dryerType": "D1210 - 300 Industrial Plant",
    "capacity": "300 sqft / 500 kg Batch",
    "imageUrl": "/projects/project-19.jpg",
    "description": "D1210 - 300 industrial plant in Gohpur, Assam operating effectively under Northeast monsoon conditions for King Chilli and regional crops."
  },
  {
    "title": "Khuangthing Hill Solar Greenhouse",
    "locationName": "Sailulak, Mizoram, Mizoram",
    "latitude": 23.10275,
    "longitude": 93.202278,
    "cropDrying": "Organic Ginger, Turmeric & Chillies",
    "dryerType": "D1210 - 300 Solar Polyhouse",
    "capacity": "300 kg Batch Setup",
    "imageUrl": "/projects/project-23.jpg",
    "description": "D1210 - 300 solar greenhouse tunnel dryer in Khuangthing, Mizoram for organic ginger, turmeric, and Naga chilli processing."
  },
  {
    "title": "Chennai Suburban Agro Dryer",
    "locationName": "Chennai Region, Tamil Nadu",
    "latitude": 12.971694,
    "longitude": 80.204194,
    "cropDrying": "Spices, Herbs & Food Products",
    "dryerType": "SOLDRY 1210 Setup",
    "capacity": "200 kg Batch Setup",
    "imageUrl": "/projects/project-12.jpg",
    "description": "Urban agro-processing solar thermal dryer serving micro-entrepreneurs in greater Chennai region."
  },
  {
    "title": "Chintamani Agricultural Solar Dryer",
    "locationName": "Chintamani, Karnataka",
    "latitude": 13.295028,
    "longitude": 78.116167,
    "cropDrying": "Regional Agricultural Produce & Crops",
    "dryerType": "D1210 - 150 Solar Dryer",
    "capacity": "150 kg Batch Unit",
    "imageUrl": "/projects/project-25.jpg",
    "description": "D1210 - 150 business installation in Chintamani, Karnataka for multi-crop commercial drying and regional agricultural produce."
  }
];

export const initialReviews = [
  {
    name: "K. Subramaniam",
    role: "Coconut Farmer & FPO Director",
    location: "Pollachi, Tamil Nadu",
    rating: 5,
    comment: "Installing ZeniTEK's 500kg Polyhouse Dryer doubled our copra margin. We sell Grade-1 White Copra directly to oil mills at a 25% price premium without worrying about rain!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    approved: true
  },
  {
    name: "Ananya Nair",
    role: "Organic Spice Exporter",
    location: "Wayanad, Kerala",
    rating: 5,
    comment: "The essential oil retention in our pepper dried inside ZeniTEK solar dryer is unmatched. Our European buyers gave 100% lab approval on the very first shipment.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    approved: true
  },
  {
    name: "Rajesh Patil",
    role: "Food Processing Micro-Entrepreneur",
    location: "Nashik, Maharashtra",
    rating: 5,
    comment: "We got 50% State Agritech Subsidy assistance handled end-to-end by ZeniTEK. The ROI was fully recovered within 8 months of operation!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    approved: true
  }
];

const seedHandler = async (req, res) => {
  try {
    let projectsCount = initialProjects.length;
    let reviewsCount = initialReviews.length;
    let dbSeeded = false;

    try {
      await Project.deleteMany({});
      await Review.deleteMany({});

      const seededProjects = await Project.insertMany(initialProjects);
      const seededReviews = await Review.insertMany(initialReviews);
      projectsCount = seededProjects.length;
      reviewsCount = seededReviews.length;
      dbSeeded = true;
    } catch (dbErr) {
      console.warn('Database seed skipped or running in fallback mode:', dbErr.message);
    }

    return res.json({
      success: true,
      message: dbSeeded ? 'Database seeded successfully!' : 'Default dataset active in fallback mode',
      dbSeeded,
      projectsCount,
      reviewsCount
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Seeding error', error: error.message });
  }
};

router.post('/', seedHandler);
router.get('/', seedHandler);

export default router;
