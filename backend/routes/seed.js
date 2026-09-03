import express from 'express';
import Project from '../models/Project.js';
import Review from '../models/Review.js';

const router = express.Router();

export const initialProjects = [
  {
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
    title: "Nilgiris Medicinal Herb Enterprise",
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
    title: "Guntur Red Chilli Dehydration",
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
    title: "Mangalore Coastal Seafood Dryer",
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

router.post('/', async (req, res) => {
  try {
    await Project.deleteMany({});
    await Review.deleteMany({});

    const seededProjects = await Project.insertMany(initialProjects);
    const seededReviews = await Review.insertMany(initialReviews);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      projectsCount: seededProjects.length,
      reviewsCount: seededReviews.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Seeding error', error: error.message });
  }
});

export default router;
