// ZeniTEK Sample & Fallback Master Dataset

export const sampleProjects = [
  {
    _id: "p1",
    title: "Pollachi Copra Drying Hub",
    locationName: "Pollachi, Tamil Nadu",
    latitude: 10.6587,
    longitude: 77.0084,
    cropDrying: "Copra / Coconut",
    dryerType: "Commercial Polyhouse Tunnel Dryer",
    capacity: "500 kg batch",
    imageUrl: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80",
    description: "Reduced copra drying time from 7 days sun drying to 2.5 days with zero dust contamination and 100% white kernel grade."
  },
  {
    _id: "p2",
    title: "Wayanad Organic Spice Unit",
    locationName: "Wayanad, Kerala",
    latitude: 11.6854,
    longitude: 76.1320,
    cropDrying: "Black Pepper & Cardamom",
    dryerType: "Hybrid Solar Thermal Dryer",
    capacity: "300 kg batch",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    description: "Preserves natural volatile oil content in cardamom and pepper with controlled low-temperature humidity extraction."
  },
  {
    _id: "p3",
    title: "Madurai Moringa Export Processing",
    locationName: "Madurai, Tamil Nadu",
    latitude: 9.9252,
    longitude: 78.1198,
    cropDrying: "Moringa Leaf Powder",
    dryerType: "Multi-Tier Polyhouse Dryer",
    capacity: "1 Ton batch",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-hygienic green leaf powder drying for EU export compliance. Maintains 100% chlorophyll color."
  },
  {
    _id: "p4",
    title: "Nilgiris Tea & Medicinal Herb Unit",
    locationName: "Ooty, Tamil Nadu",
    latitude: 11.4102,
    longitude: 76.6950,
    cropDrying: "Medicinal Herbs & Tea Leaves",
    dryerType: "Portable DIY Solar Dryer",
    capacity: "100 kg batch",
    imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    description: "Self-help group women cooperative drying high-altitude organic herbs at 45°C constant temperature."
  },
  {
    _id: "p5",
    title: "Guntur Red Chilli Dehydration Hub",
    locationName: "Guntur, Andhra Pradesh",
    latitude: 16.3067,
    longitude: 80.4365,
    cropDrying: "Red Chillies",
    dryerType: "Multi-Tunnel Industrial Dryer",
    capacity: "2 Ton batch",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80",
    description: "Protects chillies from unseasonal rains and aflatoxin mold contamination while preserving bright red color."
  },
  {
    _id: "p6",
    title: "Mangalore Coastal Seafood Facility",
    locationName: "Mangalore, Karnataka",
    latitude: 12.9141,
    longitude: 74.8560,
    cropDrying: "Salted Fish & Shrimp",
    dryerType: "Sealed Hygienic Solar Polyhouse",
    capacity: "400 kg batch",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
    description: "100% fly-free and crow-free marine drying setup. Reduced moisture to export quality standard under 15%."
  }
];

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

export const dryerModelsData = [
  {
    id: "portable",
    name: "Portable DIY Solar Dryer",
    capacityRange: "10 to 50 kg batch",
    targetAudience: "Smallholder Farmers & Home Food Entrepreneurs",
    buildMaterial: "UV-Stabilized Polycarbonate Sheet + Galvanized Frame",
    tempRange: "40°C - 65°C",
    dimensions: "2.4m (L) x 1.2m (W) x 1.8m (H)",
    trays: "12 Food-grade Stainless Steel SS304 Trays",
    airflow: "Dual 12V DC Solar Fans (20W Monocrystalline Panel)",
    heatRetention: "Absorbent Black Thermal Bed Collector",
    paybackPeriod: "4 to 6 Months ROI",
    subsidyEligibility: "Eligible for 40% Micro-Agri Subsidy",
    badge: "Domestic / Entry",
    description: "Compact, easy-to-assemble cabinet solar thermal dryer designed for home-scale herb, fruit, and spice processing.",
    imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Zero electricity required (Dual 12V Solar Fans)",
      "Food-grade Stainless Steel SS304 Trays",
      "Portable design with heavy-duty caster wheels",
      "Plug & play 2-hour self assembly"
    ],
    compatibleCrops: ["Herbs & Tea Leaves", "Cardamom & Spices", "Sliced Mango & Fruits", "Medicinal Leaves"]
  },
  {
    id: "polyhouse",
    name: "Commercial Polyhouse Tunnel Dryer",
    capacityRange: "100 to 500 kg batch",
    targetAudience: "Self Help Groups (SHGs), FPOs & Mid-Scale Farmers",
    buildMaterial: "Multi-Wall Polycarbonate Arc Structure + SS Mesh",
    tempRange: "45°C - 70°C",
    dimensions: "10m (L) x 4m (W) x 3m (Center Height)",
    trays: "Ground Thermal Floor / 80 SS Wire Mesh Trays",
    airflow: "4x 50W Solar DC High-CFM Exhaust Blowers",
    heatRetention: "Thermal Storage Bed + Natural Chimney Draft",
    paybackPeriod: "6 to 8 Months ROI",
    subsidyEligibility: "Eligible for 50% State Agriculture Subsidy",
    badge: "Most Popular",
    description: "Walk-in greenhouse polyhouse solar tunnel dryer optimized for copra, moringa, chillies, and spice drying.",
    imageUrl: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "100% rain proof & storm resistant structure",
      "Continuous airflow exhaust with solar DC blowers",
      "Walk-in ergonomics for fast loading & unloading",
      "Protects crop from birds, dust, and insects"
    ],
    compatibleCrops: ["Copra / Coconut", "Moringa Leaves", "Red Chillies", "Salted Fish & Marine"]
  },
  {
    id: "industrial",
    name: "Multi-Tunnel Industrial Hybrid Dryer",
    capacityRange: "1 Ton+ batch (Customizable)",
    targetAudience: "Large Food Exporters, Industrial Sludge & Rubber Processors",
    buildMaterial: "Heavy Galvanized Structural Steel + Solar Collectors",
    tempRange: "50°C - 85°C",
    dimensions: "25m (L) x 8m (W) x 3.5m (H) (Modular Extension)",
    trays: "Automated Trolley Carts / Continuous Conveyor Mesh",
    airflow: "PLC Variable Speed Automated Humidity Exhaust Fan Grid",
    heatRetention: "Thermal Mass Storage + Hybrid Biomass/Steam Backup",
    paybackPeriod: "8 to 12 Months ROI",
    subsidyEligibility: "Eligible for MNRE & NABARD Industrial Grants",
    badge: "Industrial Grade",
    description: "Heavy-duty modular multi-tunnel drying plant with automated humidity sensors and optional biomass thermal backup.",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "PLC Smart controller for precision temperature monitoring",
      "24/7 continuous operation with hybrid biomass heat backup",
      "Up to 80% weight reduction for industrial sludge & waste",
      "Custom conveyor or tray cart material handling systems"
    ],
    compatibleCrops: ["Bulk Copra", "Turmeric & Ginger", "Export Grade Chillies", "Industrial Rubber & Sludge"]
  }
];

export const cropMatrixData = [
  { crop: "Copra / Coconut", freshMoisture: "52%", targetMoisture: "6%", solarDays: "2.5 Days", openSunDays: "7 Days", benefit: "100% Grade-1 White Copra, zero fungus" },
  { crop: "Moringa Leaves", freshMoisture: "80%", targetMoisture: "8%", solarDays: "1.2 Days", openSunDays: "4 Days", benefit: "Preserves 100% chlorophyll green & Vitamin C" },
  { crop: "Red Chillies", freshMoisture: "75%", targetMoisture: "10%", solarDays: "3.0 Days", openSunDays: "10 Days", benefit: "Zero aflatoxin, bright red glossy skin retain" },
  { crop: "Salted Fish & Shrimp", freshMoisture: "60%", targetMoisture: "15%", solarDays: "1.0 Day", openSunDays: "3 Days", benefit: "100% fly-free export sanitation quality" },
  { crop: "Cloves & Spices", freshMoisture: "70%", targetMoisture: "12%", solarDays: "2.0 Days", openSunDays: "6 Days", benefit: "High volatile essential oil content lock" }
];

export const sampleGalleryItems = [
  {
    id: "g1",
    title: "500kg Copra Drying Polyhouse Tunnel",
    category: "installations",
    location: "Pollachi, Tamil Nadu",
    modelName: "Commercial Polyhouse Tunnel Dryer",
    imageUrl: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
    caption: "Full walk-in polyhouse solar tunnel dryer setup producing Grade-1 White Copra for oil extraction."
  },
  {
    id: "g2",
    title: "Organic Cardamom & Black Pepper Drying Unit",
    category: "installations",
    location: "Wayanad, Kerala",
    modelName: "Hybrid Solar Thermal Dryer",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    caption: "Preserving natural essential oils and vibrant green color in premium exported spices."
  },
  {
    id: "g3",
    title: "Grade-1 White Copra Kernels",
    category: "produce",
    location: "Coimbatore, Tamil Nadu",
    modelName: "Polyhouse Tunnel Dryer",
    imageUrl: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
    caption: "Moisture reduced from 52% to 6% in 2.5 days. Zero fungal spores, zero dust contamination."
  },
  {
    id: "g4",
    title: "Export Grade Dehydrated Moringa Leaf Powder",
    category: "produce",
    location: "Madurai, Tamil Nadu",
    modelName: "Multi-Tier Polyhouse Dryer",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    caption: "100% chlorophyll green color retention with UV-shielded solar drying."
  },
  {
    id: "g5",
    title: "Portable DIY 50kg Herb & Fruit Cabinet Dryer",
    category: "models",
    location: "Ooty, Tamil Nadu",
    modelName: "Portable DIY Solar Dryer",
    imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
    caption: "Compact entry-level solar dryer operating on 12V solar DC fans."
  },
  {
    id: "g6",
    title: "High-Gloss Export Red Chillies",
    category: "produce",
    location: "Guntur, Andhra Pradesh",
    modelName: "Multi-Tunnel Industrial Dryer",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
    caption: "Rainproof chili drying eliminating aflatoxin mold risk and maintaining bright red glossy skin."
  },
  {
    id: "g7",
    title: "Coimbatore Manufacturing Facility & Assembly",
    category: "factory",
    location: "Coimbatore Works, Tamil Nadu",
    modelName: "ZeniTEK Production Hub",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    caption: "Precision fabrication of UV-stabilized multi-wall polycarbonate arcs and food-grade SS304 tray frames."
  },
  {
    id: "g8",
    title: "Hygienic Marine Fish & Shrimp Drying Setup",
    category: "installations",
    location: "Mangalore, Karnataka",
    modelName: "Sealed Polyhouse Solar Dryer",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    caption: "100% fly-free sealed coastal drying setup compliant with international export standards."
  }
];

