// ZeniTEK Official Product & Engineering Brochure Dataset
// Extracted from the official ZeniTEK PDF Product Line Catalog

export const brochurePages = [
  {
    page: 1,
    id: "soldry-1210-150",
    title: "SOLDRY 1210 - 150 Tunnel Type Solar Dryer",
    subtitle: "Sustainable Drying Solution for a Healthier Tomorrow",
    image: "/pdf-products/brochure_p1.png",
    category: "Tunnel Dryer",
    floorArea: "150 sq.ft",
    trayArea: "225 sq.ft (36 trays)",
    summary: "Standard 150 sq.ft tunnel type solar dryer engineered with GI steel structure, 6mm UV polycarbonate sheet, PLC 4\" touchscreen HMI, Victron MPPT solar power, and 36 SS304 perforated food-grade trays."
  },
  {
    page: 2,
    id: "soldry-1709-200",
    title: "SOLDRY 1709 - 200 Inverted Parabolic Tunnel Type Solar Dryer",
    subtitle: "Smart Drying for a Healthier Tomorrow • 200 Sq.ft Floor Area",
    image: "/pdf-products/brochure_p2.png",
    category: "Tunnel Dryer",
    floorArea: "200 sq.ft",
    trayArea: "225 sq.ft (36 trays)",
    summary: "Inverted parabolic aerodynamic arch profile providing 200 sq.ft floor area with 17 ft front width, 4 internal circulation fans, 2 exhaust fans, and hybrid heating backup."
  },
  {
    page: 3,
    id: "profile-comparison",
    title: "SOLDRY Solar Tunnel Dryer Profile Comparison",
    subtitle: "150 • 200 • 250 SQ.FT — Same Construction Technology, Different Profiles, More Usable Floor Area",
    image: "/pdf-products/brochure_p3.png",
    category: "Engineering Analysis",
    floorArea: "150 to 1,000 sq.ft",
    trayArea: "Modular & Scalable",
    summary: "Side-by-side engineering comparison between SOLDRY 1210-150 (Tray Drying), SOLDRY 1709-200 (Tray + Floor Drying), and SOLDRY 2008-250 (Floor Drying), scalable up to 1,000 sq.ft."
  },
  {
    page: 4,
    id: "sundry-6",
    title: "SUNDRY 6 Box Type Solar Dryer",
    subtitle: "Compact • Efficient • Hygienic — Smart Drying Powered by the Sun",
    image: "/pdf-products/brochure_p4.png",
    category: "Box Type Dryer",
    floorArea: "8 sq.ft",
    trayArea: "6.25 sq.ft (1 SS304 tray)",
    summary: "Portable box solar dryer with 20W solar panel, thermostat exhaust fan, 500W electric heater, and caster wheels. Ideal for households, herbalists, and kitchen entrepreneurs."
  },
  {
    page: 5,
    id: "sundry-12",
    title: "SUNDRY 12 Box Type Solar Dryer",
    subtitle: "Harness the Sun for a Healthier Tomorrow — Natural, Clean, Nutritious, Sustainable",
    image: "/pdf-products/brochure_p5.png",
    category: "Box Type Dryer",
    floorArea: "8 sq.ft",
    trayArea: "12 sq.ft (2 SS304 trays)",
    summary: "Dual-tier box dryer with 12 sq.ft tray drying capacity, 20W solar fan, 500W hybrid night heater, and optional 2 ft leg extension with 2\" caster wheels."
  },
  {
    page: 6,
    id: "sundry-50",
    title: "SUNDRY 50 Box Type Solar Dryer",
    subtitle: "Efficient • Hygienic • Reliable — 50 Sq.ft Tray Drying Area, 20 Kg to 100 Kg",
    image: "/pdf-products/brochure_p6.png",
    category: "Box Type Dryer",
    floorArea: "16 sq.ft",
    trayArea: "50 sq.ft (8 SS304 trays)",
    summary: "High-capacity commercial box dryer with 8 trays, 4 internal circulation fans, 2 exhaust fans, 24V solar + SMPS grid backup, and 750W thermostat heater on 4\" caster wheels."
  },
  {
    page: 7,
    id: "segmentation-tiers",
    title: "Solar Drying Solutions for Every Need",
    subtitle: "Household Model • Small Business Model • Commercial Large Scale",
    image: "/pdf-products/brochure_p7.png",
    category: "Product Solutions",
    floorArea: "8 sq.ft to 1,000 sq.ft",
    trayArea: "6.25 sq.ft to 500+ sq.ft",
    summary: "Three tailored product tiers engineered for homes (SUNDRY 6 & 12), agri-entrepreneurs (SUNDRY 50), and industrial commercial producers (SOLDRY series)."
  },
  {
    page: 8,
    id: "working-principle",
    title: "Solar Dryer Working Principle",
    subtitle: "Smart, Efficient, Sustainable — 7-Step Precision Thermal Engineering",
    image: "/pdf-products/brochure_p8.png",
    category: "Technology",
    floorArea: "All Models",
    trayArea: "Thermodynamic Flow",
    summary: "Step-by-step scientific cycle: Solar Heat Generation, Moisture Release, Moist Air Exhaust & Fresh Air Intake, Automatic Control, UV Protection, Hygienic Enclosed Drying, and 40% Faster Drying."
  },
  {
    page: 9,
    id: "soldry-1210-300",
    title: "SOLDRY 1210 - 300 Tunnel Type Solar Dryer",
    subtitle: "Dry • Preserve • Add Value Naturally — 300 Sq.ft Floor Area, 72 Trays (450 Sq.ft)",
    image: "/pdf-products/brochure_p9.png",
    category: "Tunnel Dryer",
    floorArea: "300 sq.ft",
    trayArea: "450 sq.ft (72 trays)",
    summary: "Commercial 300 sq.ft tunnel dryer featuring 18 trolleys, 72 food-grade SS304 trays, 3 exhaust blowers, 4 internal circulation fans, 220W 24V solar array with Victron MPPT, and 1kW to 6kW auxiliary heater."
  }
];

export const officialDryerModels = [
  // 1. SUNDRY 6
  {
    id: "sundry-6",
    modelCode: "SUNDRY 6",
    name: "SUNDRY 6 Box Type Solar Dryer",
    category: "Box Type Solar Dryer",
    tier: "Household Model",
    badge: "Compact & Home",
    targetAudience: "Households, Small Kitchen Businesses & Herbalists",
    tagline: "Smart Drying Powered by the Sun • 40% Faster Than Open-Sun Drying",
    imageUrl: "/pdf-products/brochure_p4.png",
    realProductPhoto: "/pdf-gallery/gallery_13_p1.jpg",
    brochurePageImage: "/pdf-products/brochure_p4.png",
    gallery: [
      "/pdf-products/brochure_p4.png",
      "/pdf-gallery/gallery_13_p1.jpg"
    ],
    capacityRange: "2.5 kg to 12.5 kg per batch (400g/sq.ft light to 2kg/sq.ft dense)",
    floorArea: "8 sq.ft",
    totalTrayArea: "6.25 sq.ft",
    trayCount: "1 No. (SS304 perforated sheet)",
    traySize: "42\" x 22\" x 1\"",
    dimensions: "4 ft (L) x 2 ft (W) x 1 ft (H) + 2 ft leg height option",
    structure: "GI steel with 6mm double-walled polycarbonate sheet (UV protected)",
    solarPower: "20W 12V DC Solar Panel (powers exhaust fan)",
    electricalHeater: "500W electrical heater with fan (thermostat controlled)",
    gridBackup: "Standard 230V AC socket plug-in",
    exhaustFans: "1 No. (thermostat controlled)",
    circulationFans: "Natural convection airflow",
    controller: "Analog/Digital Thermostat Control",
    mobility: "2\" caster wheels for easy relocation",
    subsidyEligibility: "Eligible for Micro-Agri & Home Enterprise Grants",
    paybackPeriod: "3 to 5 Months",
    description: "Compact, efficient, and 100% hygienic box type solar dryer. Designed for small businesses, kitchen entrepreneurs, and households desiring dust-free and rain-proof drying of fruits, vegetables, flowers, spices, and herbs.",
    keyFeatures: [
      "GI steel frame covered with 6mm double-walled UV-coated polycarbonate",
      "Thermostat-controlled exhaust fan for rapid hot and moist air removal",
      "Powered by 20W 12V DC solar panel with zero grid dependency for daytime ventilation",
      "500W electric heater with fan for night-time & rainy day drying",
      "Food-grade SS304 perforated tray (42\" x 22\" x 1\")",
      "2\" caster wheels and optional 2 ft leg extension for ergonomic loading"
    ],
    compatibleCrops: ["Herbs & Leaves", "Cut Flowers", "Red Chillies", "Turmeric Slices", "Banana & Fruits", "Fish", "Spices"]
  },

  // 2. SUNDRY 12
  {
    id: "sundry-12",
    modelCode: "SUNDRY 12",
    name: "SUNDRY 12 Box Type Solar Dryer",
    category: "Box Type Solar Dryer",
    tier: "Household Model",
    badge: "Dual Tray Compact",
    targetAudience: "Small Businesses, Agri-Entrepreneurs & Families",
    tagline: "Natural, Clean, Nutritious, Sustainable Drying Solution",
    imageUrl: "/pdf-products/brochure_p5.png",
    realProductPhoto: "/pdf-gallery/gallery_13_p2.jpg",
    brochurePageImage: "/pdf-products/brochure_p5.png",
    gallery: [
      "/pdf-products/brochure_p5.png",
      "/pdf-gallery/gallery_13_p2.jpg"
    ],
    capacityRange: "5 kg to 25 kg per batch (400g/sq.ft light to 2kg/sq.ft dense)",
    floorArea: "8 sq.ft",
    totalTrayArea: "12 sq.ft (6.25 sq.ft per tray)",
    trayCount: "2 Nos. (SS304 perforated sheet)",
    traySize: "42\" x 22\" x 1\"",
    dimensions: "4 ft (L) x 2 ft (W) x 2 ft (H) + optional 2 ft leg height",
    structure: "GI steel structure with 6mm double-walled polycarbonate sheet (UV protection)",
    solarPower: "20W 12V DC Solar Panel (powers exhaust fan)",
    electricalHeater: "500W electrical heater with fan (thermostat controlled)",
    gridBackup: "Standard 230V AC socket plug-in",
    exhaustFans: "1 No. (thermostat controlled)",
    circulationFans: "Internal dual-level air draft",
    controller: "Thermostat temperature regulation",
    mobility: "2\" caster wheels for effortless maneuvering",
    subsidyEligibility: "Eligible for 40% State Micro-Enterprise Subsidy",
    paybackPeriod: "4 to 6 Months",
    description: "Two-tray compact solar box dryer providing 12 sq.ft of SS304 food-grade drying area. Double-tiered capacity is ideal for home farmers and small food startups producing dried mango, moringa flakes, mushroom, and medicinal herbs.",
    keyFeatures: [
      "Dual SS304 perforated food-grade trays with 12 sq.ft drying area",
      "UV-protected 6mm double-walled polycarbonate glazing on all sides",
      "Thermostat exhaust fan powered by 20W 12V DC solar panel",
      "500W auxiliary night heating for round-the-clock uninterrupted drying",
      "Full rain, dust, and insect barrier keeping product 100% sterile",
      "Heavy duty 2\" caster wheels with optional 2 ft elevation leg kit"
    ],
    compatibleCrops: ["Mushroom", "Moringa Flakes", "Turmeric Slices", "Dry Fruits", "Spices", "Chilli", "Fish"]
  },

  // 3. SUNDRY 50
  {
    id: "sundry-50",
    modelCode: "SUNDRY 50",
    name: "SUNDRY 50 Commercial Box Type Solar Dryer",
    category: "Box Type Solar Dryer",
    tier: "Small Business Model",
    badge: "50 Sq.ft Trays",
    targetAudience: "Small Agri-Businesses, SHGs, Cottage Industries & FPOs",
    tagline: "Efficient • Hygienic • Reliable — 20 Kg to 100 Kg Batch Capacity",
    imageUrl: "/pdf-products/brochure_p6.png",
    realProductPhoto: "/pdf-gallery/gallery_13_p1.jpg",
    brochurePageImage: "/pdf-products/brochure_p6.png",
    gallery: [
      "/pdf-products/brochure_p6.png",
      "/pdf-gallery/gallery_13_p1.jpg"
    ],
    capacityRange: "20 kg to 100 kg per batch (400g/sq.ft leafy to 2kg/sq.ft dense)",
    floorArea: "16 sq.ft",
    totalTrayArea: "50 sq.ft (8 trays x 6.25 sq.ft)",
    trayCount: "8 Nos. (SS304 perforated sheet)",
    traySize: "42\" x 22\" x 1\"",
    dimensions: "4 ft (L) x 4 ft (W) x 4 ft (H) + 1 ft leg height (Total 5 ft)",
    structure: "GI steel with 6mm double-walled polycarbonate sheet (UV protected)",
    solarPower: "20W 24V DC Solar Panel with charge controller and battery backup",
    electricalHeater: "750W electrical heater with fan (thermostat controlled)",
    gridBackup: "24V DC SMPS for continuous grid supply",
    exhaustFans: "2 Nos. (temperature & timer controlled)",
    circulationFans: "4 Nos. internal circulation fans (top-to-bottom even hot air distribution)",
    controller: "Integrated controller with temperature & timer automation",
    mobility: "4\" heavy-duty caster wheels with foot brakes",
    subsidyEligibility: "Eligible for 40% - 50% State Agriculture & MSME Subsidy",
    paybackPeriod: "5 to 7 Months",
    description: "Built for entrepreneurs and high-value value-addition. SUNDRY 50 houses 8 SS304 stainless steel trays (50 sq.ft total drying area), 4 internal circulation fans, 2 automated exhaust blowers, and 24V solar + battery storage.",
    keyFeatures: [
      "50 sq.ft tray drying area handling up to 100 kg batch volume",
      "4 internal circulation fans ensure uniform hot air distribution top-to-bottom",
      "2 exhaust fans with dual temperature and timer control to expel humidity",
      "24V DC solar array with battery backup and 24V DC SMPS grid failover",
      "750W thermostat-regulated heater for continuous night and monsoon operation",
      "4\" industrial caster wheels for effortless rolling between yard and indoor storage"
    ],
    compatibleCrops: ["Copra / Coconut", "Turmeric Fingers", "Red Chillies", "Herbal Leaves", "Ginger", "Fish & Shrimp", "Flower Petals"]
  },

  // 4. SOLDRY 1210 - 150
  {
    id: "soldry-1210-150",
    modelCode: "SOLDRY 1210 - 150",
    name: "SOLDRY 1210 - 150 Tunnel Type Solar Dryer",
    category: "Commercial Tunnel Solar Dryer",
    tier: "Commercial Large Scale",
    badge: "Most Popular Tunnel",
    targetAudience: "Progressive Farmers, FPOs, Agri-Exporters & Co-operatives",
    tagline: "Sustainable Drying Solution for a Healthier Tomorrow • Tray Drying Specialist",
    imageUrl: "/pdf-products/brochure_p1.png",
    realProductPhoto: "/pdf-gallery/gallery_20a_p1.jpg",
    brochurePageImage: "/pdf-products/brochure_p1.png",
    gallery: [
      "/pdf-products/brochure_p1.png",
      "/pdf-gallery/gallery_20a_p1.jpg",
      "/pdf-products/brochure_p3.png"
    ],
    capacityRange: "60 kg to 300 kg per batch (400g/sq.ft to 2kg/sq.ft)",
    floorArea: "150 sq.ft",
    totalTrayArea: "225 sq.ft (36 trays)",
    trayCount: "36 Nos. (SS304 perforated sheet, 42\" x 22\" x 1\")",
    trayTrolleys: "9 Nos. (4 trays per trolley, middle row with 2\" casters)",
    dimensions: "12.5 ft Front Width x 12.5 ft Side Length x 10 ft Center Height",
    structure: "Heavy GI steel, precision laser cut & CNC folded",
    covering: "6mm double-walled polycarbonate sheet with UV protection (both sides)",
    sealing: "Aluminium top & bottom beading with EPDM rubber seals (air & water tight)",
    solarPower: "110W 24V DC Solar Panel, 24V 12Ah Battery, Victron MPPT Controller (Bluetooth)",
    electricalHeater: "1 kW to 6 kW with fan and thermostat (night / low sunlight backup)",
    gridBackup: "24V DC SMPS for seamless grid supply",
    exhaustFans: "2 Nos. (automated PLC moisture exhaust)",
    circulationFans: "4 Nos. internal circulation fans for uniform chamber convection",
    controller: "PLC with 4\" touchscreen HMI & dual inside/outside temp & humidity sensors",
    recommendedUsage: "Tray Drying (Taller 10 ft profile gives comfortable walk-in internal access)",
    subsidyEligibility: "Eligible for 50% - 60% State & National Horticulture Subsidies",
    paybackPeriod: "6 to 8 Months",
    description: "The benchmark commercial walk-in polyhouse solar tunnel dryer. Features 10 ft center clearance, 9 mobile trolleys with 36 SS304 food-grade perforated trays, industrial PLC touch automation, and Victron MPPT solar management.",
    keyFeatures: [
      "Precision CNC folded GI steel structure with 6mm double-walled UV polycarbonate glazing",
      "Air-tight and water-proof EPDM rubber beadings with aluminium profile locks",
      "9 mobile trolleys with 36 food-grade SS304 perforated trays (225 sq.ft tray area)",
      "PLC automation with 4\" color touchscreen HMI and dual interior/exterior sensors",
      "Victron Bluetooth MPPT charge controller with 110W solar panel and 24V battery bank",
      "Auxiliary 1 kW - 6 kW thermostatic fan heater ensures 24/7 continuous throughput"
    ],
    compatibleCrops: ["Copra / Coconut", "Turmeric", "Cardamom & Pepper", "Moringa", "Sago & Tapioca", "Fish", "Seeds"]
  },

  // 5. SOLDRY 1709 - 200
  {
    id: "soldry-1709-200",
    modelCode: "SOLDRY 1709 - 200",
    name: "SOLDRY 1709 - 200 Inverted Parabolic Tunnel Solar Dryer",
    category: "Commercial Tunnel Solar Dryer",
    tier: "Commercial Large Scale",
    badge: "Tray + Floor Hybrid",
    targetAudience: "Agri-Processors, Masala Manufacturers & Large Farm Clusters",
    tagline: "Smart Drying for a Healthier Tomorrow • Balanced Profile (200 Sq.ft)",
    imageUrl: "/pdf-products/brochure_p2.png",
    realProductPhoto: "/pdf-gallery/gallery_20a_p2.jpg",
    brochurePageImage: "/pdf-products/brochure_p2.png",
    gallery: [
      "/pdf-products/brochure_p2.png",
      "/pdf-gallery/gallery_20a_p2.jpg",
      "/pdf-products/brochure_p3.png"
    ],
    capacityRange: "80 kg to 400 kg per batch (combined tray and floor loading)",
    floorArea: "200 sq.ft",
    totalTrayArea: "225 sq.ft (36 trays) + spacious floor drying zone",
    trayCount: "36 Nos. (SS304 perforated sheet, 42\" x 22\" x 1\")",
    trayTrolleys: "9 Nos. (4 trays per trolley, middle row with 2\" casters)",
    dimensions: "17 ft Front Width x 12.5 ft Side Length x 9 ft Center Height",
    structure: "Inverted parabolic aerodynamic GI steel, CNC folded sheet metal",
    covering: "6mm double-walled polycarbonate sheet with UV protection (both sides)",
    sealing: "Aluminium beading with EPDM rubber beadings",
    solarPower: "110W 24V DC Solar Panel, 24V 12Ah Battery, Victron MPPT Controller (Bluetooth)",
    electricalHeater: "1 kW to 6 kW with fan and thermostat",
    gridBackup: "24V DC SMPS",
    exhaustFans: "2 Nos. for hot & moist air removal",
    circulationFans: "4 Nos. internal air circulation fans",
    controller: "PLC with 4\" touchscreen HMI & dual temp/humidity sensors",
    recommendedUsage: "Tray Drying + Floor Drying (Balanced profile providing increased floor area)",
    subsidyEligibility: "Eligible for 50% State Agritech Subsidy",
    paybackPeriod: "6 to 8 Months",
    description: "Aerodynamic inverted parabolic solar tunnel dryer offering a wider 17 ft front footprint. Perfectly balances trolley-tray drying with floor bed spreading for versatile mixed-crop operations.",
    keyFeatures: [
      "17 ft wide inverted parabolic arch provides 200 sq.ft floor area with 9 ft center height",
      "Accommodates 9 tray trolleys (36 trays) plus dedicated floor space for bulk spreading",
      "High-velocity 4-fan circulation pushes hot air downward into lower tray layers",
      "Automated exhaust vents expel moist air based on real-time relative humidity delta",
      "Victron MPPT Bluetooth monitoring allows remote solar efficiency tracking on phone",
      "Enclosed cleanroom environment prevents bird droppings, fungal spores, and dust"
    ],
    compatibleCrops: ["Masala Ingredients", "Red Chillies", "Paddy & Grains", "Turmeric Rhizomes", "Cut Fruits", "Copra"]
  },

  // 6. SOLDRY 2008 - 250
  {
    id: "soldry-2008-250",
    modelCode: "SOLDRY 2008 - 250",
    name: "SOLDRY 2008 - 250 Wide Profile Tunnel Solar Dryer",
    category: "Commercial Tunnel Solar Dryer",
    tier: "Commercial Large Scale",
    badge: "Maximum Floor Area",
    targetAudience: "Bulk Grain, Seed, Chilli & Copra Producers",
    tagline: "Wider & Lower Profile Maximizes Usable Floor Area • Floor Drying Specialist",
    imageUrl: "/pdf-products/brochure_p3.png",
    realProductPhoto: "/pdf-gallery/gallery_20a_p3.jpg",
    brochurePageImage: "/pdf-products/brochure_p3.png",
    gallery: [
      "/pdf-products/brochure_p3.png",
      "/pdf-gallery/gallery_20a_p3.jpg"
    ],
    capacityRange: "100 kg to 500 kg per batch (spread floor bed capacity)",
    floorArea: "250 sq.ft",
    totalTrayArea: "Floor bed + optional modular tray racks",
    trayCount: "Floor drying design / customizable tray units",
    dimensions: "20 ft Front Width x 12.5 ft Side Length x 8 ft Center Height",
    structure: "Extra-wide span GI steel frame (laser cut & CNC folded)",
    covering: "6mm double-walled UV-stabilized polycarbonate sheet",
    sealing: "Aluminium & EPDM weather-proof gasket seal",
    solarPower: "110W - 220W 24V DC Solar Panel with Victron MPPT and battery bank",
    electricalHeater: "1 kW to 6 kW auxiliary electric heater with thermostat",
    gridBackup: "24V DC SMPS",
    exhaustFans: "2 to 3 Nos. high-CFM exhaust blowers",
    circulationFans: "4 Nos. internal convection fans",
    controller: "PLC with 4\" touchscreen HMI",
    recommendedUsage: "Floor Drying (Wider 20 ft span maximizes floor drying surface area)",
    subsidyEligibility: "Eligible for 50% - 60% Horticulture & Agri Subsidies",
    paybackPeriod: "6 to 9 Months",
    description: "Designed for operations requiring maximum floor drying footprint. The 20 ft front width maximizes square footage for bulk spreading of grains, coffee cherries, turmeric rhizomes, and whole coconuts.",
    keyFeatures: [
      "Massive 20 ft front width delivering 250 sq.ft of direct usable floor area",
      "Aerodynamic 8 ft center height traps intense thermal heat directly near floor level",
      "Double-walled polycarbonate sheet traps infrared thermal radiation continuously",
      "Automated humidity-triggered exhaust fans prevent moisture reabsorption",
      "Complete rodent, insect, rain, and dust barrier",
      "Easily expandable with modular section add-ons"
    ],
    compatibleCrops: ["Whole Coconuts / Copra", "Turmeric Rhizomes", "Paddy & Pulses", "Oil Seeds", "Chilli", "Coffee Cherries"]
  },

  // 7. SOLDRY 1210 - 300
  {
    id: "soldry-1210-300",
    modelCode: "SOLDRY 1210 - 300",
    name: "SOLDRY 1210 - 300 High-Capacity Tunnel Solar Dryer",
    category: "Commercial Tunnel Solar Dryer",
    tier: "Commercial Large Scale",
    badge: "72 Trays Commercial",
    targetAudience: "Commercial Food Exporters, Large FPOs & Processing Clusters",
    tagline: "Dry • Preserve • Add Value Naturally — 300 Sq.ft Floor, 450 Sq.ft Trays",
    imageUrl: "/pdf-products/brochure_p9.png",
    realProductPhoto: "/pdf-gallery/gallery_20a_p4.jpg",
    brochurePageImage: "/pdf-products/brochure_p9.png",
    gallery: [
      "/pdf-products/brochure_p9.png",
      "/pdf-gallery/gallery_20a_p4.jpg",
      "/pdf-products/brochure_p3.png"
    ],
    capacityRange: "180 kg to 900 kg per batch (400g/sq.ft light to 2kg/sq.ft dense)",
    floorArea: "300 sq.ft",
    totalTrayArea: "450 sq.ft (72 trays)",
    trayCount: "72 Nos. (SS304 perforated sheet, 42\" x 22\" x 1\")",
    trayTrolleys: "18 Nos. (each with 4 trays, center row with 2\" caster wheels)",
    dimensions: "12.5 ft Front Width x 24.5 ft Side Length x 10 ft Center Height",
    structure: "Heavy GI steel, laser cut & CNC folded",
    covering: "6mm double-walled polycarbonate sheet with UV protection (both sides)",
    sealing: "Top & bottom aluminium beading with EPDM rubber beadings",
    solarPower: "220W 24V DC Solar Panel, 24V 12Ah Battery, Victron MPPT Controller (Bluetooth)",
    electricalHeater: "1 kW to 6 kW electrical heater with fan and thermostat",
    gridBackup: "24V DC SMPS (grid backup)",
    exhaustFans: "3 Nos. exhaust fans for rapid hot & moist air expulsion",
    circulationFans: "4 Nos. internal air circulation fans (push hot air down to trays)",
    controller: "PLC automated control with 4\" touchscreen HMI & dual temp/humidity sensors",
    recommendedUsage: "High-Volume Commercial Tray Drying with 18 mobile trolleys",
    subsidyEligibility: "Eligible for 50% - 60% Commercial Agri & FPO Subsidies",
    paybackPeriod: "6 to 8 Months",
    description: "Flagship commercial solar tunnel system with 24.5 ft tunnel length, 18 mobile trolleys, and 72 food-grade SS304 trays delivering 450 sq.ft of clean tray drying area. Engineered for continuous industrial agricultural production.",
    keyFeatures: [
      "Extended 24.5 ft tunnel length providing 300 sq.ft floor and 450 sq.ft tray drying capacity",
      "18 heavy-duty trolleys holding 72 perforated SS304 trays for lightning-fast turnaround",
      "3 automated moisture exhaust blowers and 4 downward circulation fans",
      "Upgraded 220W 24V DC solar array with Victron Bluetooth MPPT system",
      "Integrated 1-6 kW thermostat heating unit prevents drying interruptions during rain",
      "40% faster drying than traditional open sun drying with zero contamination"
    ],
    compatibleCrops: ["Red Chillies", "Turmeric Fingers", "Moringa Powder", "Copra", "Ginger", "Fish", "Flowers", "Vegetables"]
  },

  // 8. MODULAR SCALABLE UP TO 1000 SQ.FT
  {
    id: "soldry-modular-1000",
    modelCode: "SOLDRY 1000 MODULAR",
    name: "SOLDRY Modular & Scalable Commercial Solar Polyhouse",
    category: "Commercial Tunnel Solar Dryer",
    tier: "Commercial Large Scale",
    badge: "Scalable to 1,000 Sq.ft",
    targetAudience: "Mega Exporters, Corporate Agri-Farms & Government Processing Hubs",
    tagline: "Scalable Length up to 53 ft • Floor Area up to 1,000 Sq.ft",
    imageUrl: "/pdf-products/brochure_p3.png",
    realProductPhoto: "/pdf-gallery/gallery_20b_p1.jpg",
    brochurePageImage: "/pdf-products/brochure_p3.png",
    gallery: [
      "/pdf-products/brochure_p3.png",
      "/pdf-gallery/gallery_20b_p1.jpg",
      "/pdf-products/brochure_p9.png"
    ],
    capacityRange: "500 kg to 2,500+ kg per batch",
    floorArea: "Up to 1,000 sq.ft",
    totalTrayArea: "Scalable up to 1,000+ sq.ft (custom trolley configurations)",
    trayCount: "Custom modular trolleys & trays as per client requirement",
    dimensions: "Up to 53 ft length x 12.5 ft - 20 ft width x 8 ft - 10 ft height",
    structure: "Industrial GI steel truss structure with CNC laser precision components",
    covering: "6mm double-walled multi-layer UV polycarbonate glazing",
    sealing: "Engineered aluminium expansion beading with high-grade EPDM rubber gaskets",
    solarPower: "Custom multi-array 24V/48V solar power plants with smart MPPT controllers",
    electricalHeater: "Multi-zone auxiliary heating units with independent thermostat relays",
    gridBackup: "Industrial 24V/48V SMPS power racks",
    exhaustFans: "Multi-blower automated exhaust grid with zone-based humidity sensors",
    circulationFans: "Distributed high-efficiency brushless DC circulation fans",
    controller: "Multi-zone industrial PLC with full data acquisition & remote IoT telemetry",
    recommendedUsage: "Mega Agri Processing, Co-operative Hubs & Export Food Dehydration",
    subsidyEligibility: "Eligible for Central & State Mega Food Park Subsidies up to 60%",
    paybackPeriod: "8 to 12 Months",
    description: "Custom-engineered modular solar tunnel architecture. Tunnel length can be extended using interlocking prefabricated sections up to 53 ft length and 1,000 sq.ft floor area with complete turnkey commissioning.",
    keyFeatures: [
      "Modular section interlocking allows seamless on-site length expansion",
      "Scalable up to 1,000 sq.ft floor area with multi-ton batch processing capacity",
      "Zone-by-zone digital humidity and temperature mapping for precision consistency",
      "Compatible with automated roll-in trolley trains or continuous conveyor systems",
      "Certified MNRE standards and full subsidy technical documentation provided",
      "Over 35 commercial installations successfully operational across 9 Indian states"
    ],
    compatibleCrops: ["Bulk Marine Fish", "Export Grade Moringa", "Spice Consignments", "Copra Operations", "Industrial Agritech"]
  }
];

// 7-Step Scientific Working Principle (from Page 8 of PDF)
export const workingPrincipleSteps = [
  {
    step: 1,
    title: "Solar Heat Generation",
    subtitle: "Thermal Radiation Absorption",
    description: "Sunlight enters through the 6mm double-walled polycarbonate sheet and heats up the air inside the chamber, creating a powerful greenhouse thermal effect.",
    icon: "Sun"
  },
  {
    step: 2,
    title: "Moisture Release",
    subtitle: "Vaporization from Produce",
    description: "As the temperature increases, the relative humidity of the inside air drops significantly, allowing moisture from deep inside the crop to evaporate rapidly into the air.",
    icon: "Droplets"
  },
  {
    step: 3,
    title: "Moisture Exhaust & Fresh Air Intake",
    subtitle: "Continuous Thermodynamic Ventilation",
    description: "Fresh ambient air enters through the bottom inlets on both sides of the front door. The top exhaust fans at the rear side continuously remove moist air to the outside.",
    icon: "Wind"
  },
  {
    step: 4,
    title: "Automatic Control",
    subtitle: "PLC & Digital Sensor Optimization",
    description: "The drying cycle is automatically controlled by a digital controller based on continuous temperature and humidity readings inside and outside to maintain optimal drying conditions.",
    icon: "Cpu"
  },
  {
    step: 5,
    title: "UV Protection",
    subtitle: "Quality & Color Preservation",
    description: "The UV-protected polycarbonate sheet blocks harmful UV radiation, protecting the crop from UV-induced degradation, color fading, and nutrient loss.",
    icon: "Shield"
  },
  {
    step: 6,
    title: "Hygienic Drying",
    subtitle: "100% Hermetically Sealed Sanitation",
    description: "The fully enclosed drying environment protects the product from dust, rain, insects, birds, and other external contaminants, providing sterile, export-grade hygiene.",
    icon: "ShieldCheck"
  },
  {
    step: 7,
    title: "Faster Drying",
    subtitle: "40% Time Reduction vs Open Sun",
    description: "Higher internal temperature and lower relative humidity inside the dryer compared with ambient conditions accelerate moisture removal, resulting in 40% faster drying without burning or nutrient decay.",
    icon: "Zap"
  }
];

// Profile Comparison Data (from Page 3 of PDF)
export const profileComparisonData = [
  {
    model: "SOLDRY 1210 - 150",
    frontWidth: "12.5 ft",
    centreHeight: "10 ft",
    floorArea: "150 sq.ft",
    recommendedFor: "Tray Drying",
    profileBadge: "Taller & Narrower",
    profileDescription: "Taller and narrower profile provides convenient internal access and is particularly suitable for trolley-and-tray drying arrangements.",
    suitableArrangement: "9 Trolleys with 36 SS304 Trays (225 sq.ft tray drying area)"
  },
  {
    model: "SOLDRY 1709 - 200",
    frontWidth: "17 ft",
    centreHeight: "9 ft",
    floorArea: "200 sq.ft",
    recommendedFor: "Tray Drying + Floor Drying",
    profileBadge: "Balanced Profile",
    profileDescription: "A balanced profile providing increased floor area while maintaining good accessibility and excellent internal airflow circulation.",
    suitableArrangement: "9 Trolleys (36 Trays) + Dedicated Floor Bed Spreading Area"
  },
  {
    model: "SOLDRY 2008 - 250",
    frontWidth: "20 ft",
    centreHeight: "8 ft",
    floorArea: "250 sq.ft",
    recommendedFor: "Floor Drying",
    profileBadge: "Wider & Lower",
    profileDescription: "Wider and lower profile maximizes usable floor area. Accessibility near extreme side corners is comparatively limited because of reduced side height.",
    suitableArrangement: "Full 250 sq.ft Floor Spreading for Bulk Crops & Produce"
  }
];

// Key Benefits Matrix (from PDF Brochures)
export const brochureKeyBenefits = [
  { title: "Nutrients Preserved", desc: "Low-temperature thermal drying locks in vitamins, enzymes, and essential aromatic oils.", icon: "Sparkles" },
  { title: "Colour & Aroma Preserved", desc: "UV-shielded glazing prevents direct sun bleaching and preserves vivid natural hues.", icon: "Sun" },
  { title: "Dust & Insect Free", desc: "Completely enclosed hermetic structure prevents dust contamination, bird droppings, and flies.", icon: "Shield" },
  { title: "Protected from Rain & Weather", desc: "Heavy-duty CNC GI frame and EPDM beading ensure 100% storm and rain protection.", icon: "CloudRain" },
  { title: "Hygienic Export Quality", desc: "Complies with FSSAI, APEDA, and international food sanitation export requirements.", icon: "CheckCircle" },
  { title: "Uniform Consistent Drying", desc: "Internal circulation fans eliminate cold spots, guaranteeing uniform batch moisture.", icon: "RotateCw" },
  { title: "Better Shelf Life & Higher Value", desc: "Eliminates mold spores and aflatoxin risk, commanding a 20% - 40% price premium.", icon: "TrendingUp" },
  { title: "40% Faster Turnaround", desc: "Halves drying time compared to conventional open-yard spreading, doubling farm turnover.", icon: "Zap" }
];
