// ZeniTEK Master Locations Dataset
import { activeLocationsData } from './mapLocationsData';

// All 35 active GPS installation sites from client specifications
export const sampleProjects = activeLocationsData;


export const sampleReviews = [
  {
    _id: "r1",
    name: "K. Subramaniam",
    role: "Coconut Farmer & FPO Director",
    location: "Pollachi, Tamil Nadu",
    rating: 5,
    comment: "Installing ZeniTEK's 500kg Polyhouse Dryer doubled our copra margin. We sell Grade-1 White Copra directly to oil mills at a 25% price premium without worrying about rain!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    approved: true
  },
  {
    _id: "r2",
    name: "Ananya Nair",
    role: "Organic Spice Exporter",
    location: "Wayanad, Kerala",
    rating: 5,
    comment: "The essential oil retention in our pepper dried inside ZeniTEK solar dryer is unmatched. Our European buyers gave 100% lab approval on the very first shipment.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    approved: true
  },
  {
    _id: "r3",
    name: "Rajesh Patil",
    role: "Food Processing Micro-Entrepreneur",
    location: "Nashik, Maharashtra",
    rating: 5,
    comment: "We got 50% State Agritech Subsidy assistance handled end-to-end by ZeniTEK. The ROI was fully recovered within 8 months of operation!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    approved: true
  }
];

export const cropCalculations = {
  'Copra/Coconut': {
    sunDryingDays: 7,
    solarDryingDays: 2.5,
    premiumPercent: 28,
    savingsPerKg: 18,
    moistureDrop: '52% → 6%'
  },
  'Moringa/Herbs': {
    sunDryingDays: 4,
    solarDryingDays: 1.2,
    premiumPercent: 35,
    savingsPerKg: 45,
    moistureDrop: '80% → 8%'
  },
  'Spices/Chillies': {
    sunDryingDays: 10,
    solarDryingDays: 3,
    premiumPercent: 22,
    savingsPerKg: 30,
    moistureDrop: '75% → 10%'
  },
  'Fruits/Veggies': {
    sunDryingDays: 5,
    solarDryingDays: 1.5,
    premiumPercent: 40,
    savingsPerKg: 25,
    moistureDrop: '85% → 12%'
  },
  'Fish/Seafood': {
    sunDryingDays: 3,
    solarDryingDays: 1,
    premiumPercent: 50,
    savingsPerKg: 60,
    moistureDrop: '60% → 15%'
  },
  'Other': {
    sunDryingDays: 6,
    solarDryingDays: 2,
    premiumPercent: 25,
    savingsPerKg: 20,
    moistureDrop: '70% → 10%'
  }
};

import { officialDryerModels } from './zenitekBrochureData';

export const dryerModelsData = officialDryerModels;

export const cropMatrixData = [
  { crop: "Copra / Coconut", freshMoisture: "52%", targetMoisture: "6%", solarDays: "2.5 Days", openSunDays: "7 Days", benefit: "100% Grade-1 White Copra, zero fungus, 28% higher price" },
  { crop: "Moringa Leaves", freshMoisture: "88%", targetMoisture: "8%", solarDays: "1.2 Days", openSunDays: "4 Days", benefit: "Preserves 100% chlorophyll green, Vitamin C & active nutrients" },
  { crop: "Red Chillies", freshMoisture: "75%", targetMoisture: "10%", solarDays: "3.0 Days", openSunDays: "10 Days", benefit: "Zero aflatoxin mold, bright natural gloss, high oleoresin" },
  { crop: "Salted Fish & Shrimp", freshMoisture: "60%", targetMoisture: "15%", solarDays: "1.0 Day", openSunDays: "3 Days", benefit: "100% fly-free sealed coastal export sanitation quality" },
  { crop: "Turmeric & Ginger", freshMoisture: "80%", targetMoisture: "10%", solarDays: "2.5 Days", openSunDays: "8 Days", benefit: "Maximum curcumin & essential volatile oil retention" },
  { crop: "Flowers & Tea/Herbs", freshMoisture: "80%", targetMoisture: "8%", solarDays: "1.0 Day", openSunDays: "3.5 Days", benefit: "Vibrant petal color without UV discoloration" }
];

export const sampleGalleryItems = [
  {
    id: "g1",
    title: "SOLDRY 1210 - 150 Walk-In Tunnel Dryer",
    category: "installations",
    location: "Komarapalayam, Tamil Nadu",
    modelName: "SOLDRY 1210 - 150",
    imageUrl: "/pdf-products/brochure_p1.png",
    caption: "Walk-in polyhouse solar tunnel dryer with 9 trolleys and 36 SS304 trays for commercial drying."
  },
  {
    id: "g2",
    title: "SOLDRY 1709 - 200 Inverted Parabolic Arch",
    category: "installations",
    location: "Sathyamangalam, Tamil Nadu",
    modelName: "SOLDRY 1709 - 200",
    imageUrl: "/pdf-products/brochure_p2.png",
    caption: "Aerodynamic 17 ft wide parabolic profile combining tray trolleys and floor drying bed."
  },
  {
    id: "g3",
    title: "SOLDRY 1210 - 300 Industrial Tunnel Plant",
    category: "installations",
    location: "Pollachi, Tamil Nadu",
    modelName: "SOLDRY 1210 - 300",
    imageUrl: "/pdf-products/brochure_p9.png",
    caption: "High-capacity commercial system with 18 trolleys, 72 food-grade trays, and 450 sq.ft tray drying area."
  },
  {
    id: "g4",
    title: "SUNDRY 50 Commercial 8-Tray Box Dryer",
    category: "models",
    location: "ZeniTEK Works, Erode",
    modelName: "SUNDRY 50",
    imageUrl: "/pdf-products/brochure_p6.png",
    caption: "50 sq.ft tray area on heavy-duty 4\" caster wheels with 24V solar battery storage and SMPS."
  },
  {
    id: "g5",
    title: "SUNDRY 12 Dual-Tier Compact Box Dryer",
    category: "models",
    location: "Erode, Tamil Nadu",
    modelName: "SUNDRY 12",
    imageUrl: "/pdf-products/brochure_p5.png",
    caption: "12 sq.ft SS304 perforated food-grade trays with 20W solar fan and 500W night heater."
  },
  {
    id: "g6",
    title: "SUNDRY 6 Household Smart Solar Dryer",
    category: "models",
    location: "Erode, Tamil Nadu",
    modelName: "SUNDRY 6",
    imageUrl: "/pdf-products/brochure_p4.png",
    caption: "Compact box solar dryer for households, small entrepreneurs, and farm kitchens."
  },
  {
    id: "g7",
    title: "Commercial Operational Field Installation",
    category: "installations",
    location: "Field Site, Tamil Nadu",
    modelName: "Commercial Polyhouse Tunnel",
    imageUrl: "/pdf-gallery/gallery_20a_p1.jpg",
    caption: "Active operational solar polyhouse tunnel installation in farm fields."
  },
  {
    id: "g8",
    title: "Precision Fabrication & CNC Assembly",
    category: "factory",
    location: "Manufacturing Hub, Erode",
    modelName: "ZeniTEK Works",
    imageUrl: "/pdf-gallery/gallery_13_p1.jpg",
    caption: "GI steel laser cut and CNC folded frame with double-walled UV polycarbonate glazing."
  }
];

