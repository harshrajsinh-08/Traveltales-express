import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Middleware to check if user is logged in for API routes
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Helper to load JSON files safely
function loadJSON(fileName) {
  try {
    const filePath = path.join(process.cwd(), "public", fileName);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error(`Error loading ${fileName}:`, err);
    return [];
  }
}

// Helper to save JSON files
function saveJSON(fileName, data) {
  try {
    const filePath = path.join(process.cwd(), "public", fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error saving ${fileName}:`, err);
    return false;
  }
}

/* ------------------------
   API ROUTES
------------------------ */

// Get all destinations
router.get("/destinations", (req, res) => {
  const trips = loadJSON("trips.json");
  const destinations = Object.keys(trips).map((city) => ({
    name: city,
    image: trips[city].city_image,
    attractions: trips[city].attractions?.length || 0,
  }));
  res.json(destinations);
});

// Search destinations
router.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const trips = loadJSON("trips.json");
  const results = Object.keys(trips)
    .filter((city) => city.toLowerCase().includes(q.toLowerCase()))
    .map((city) => ({
      name: city,
      image: trips[city].city_image,
      attractions: trips[city].attractions?.length || 0,
    }))
    .slice(0, 10);

  res.json(results);
});

// Get destination details
router.get("/destination/:name", (req, res) => {
  const trips = loadJSON("trips.json");
  const destination = trips[req.params.name];

  if (!destination) {
    return res.status(404).json({ error: "Destination not found" });
  }

  res.json({
    name: req.params.name,
    ...destination,
  });
});

// Get user's wishlist
router.get("/wishlist", requireAuth, (req, res) => {
  // In a real app, this would come from the database
  // For now, return sample data
  res.json([
    {
      name: "Kerala",
      image:
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400",
    },
    {
      name: "Manali",
      image:
        "https://images.unsplash.com/photo-1621617249658-f7541ef42a93?w=400",
    },
  ]);
});

// Add to wishlist
router.post("/wishlist", requireAuth, (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination name required" });
  }

  // In a real app, save to database
  // For now, just return success
  res.json({ message: "Added to wishlist", destination });
});

// Remove from wishlist
router.delete("/wishlist/:destination", requireAuth, (req, res) => {
  const { destination } = req.params;

  // In a real app, remove from database
  // For now, just return success
  res.json({ message: "Removed from wishlist", destination });
});

// Get travel tips
router.get("/tips", (req, res) => {
  const tips = [
    {
      id: 1,
      title: "Best Time to Visit India",
      content:
        "October to March is generally the best time to visit most parts of India.",
      category: "Planning",
    },
    {
      id: 2,
      title: "Packing Essentials",
      content:
        "Pack light, comfortable clothes and always carry a first-aid kit.",
      category: "Packing",
    },
    {
      id: 3,
      title: "Local Transportation",
      content:
        "Use local trains and buses for authentic experiences and budget travel.",
      category: "Transport",
    },
    {
      id: 4,
      title: "Food Safety",
      content:
        "Drink bottled water and eat at busy local restaurants for fresh food.",
      category: "Health",
    },
  ];

  const { category } = req.query;
  if (category) {
    const filtered = tips.filter(
      (tip) => tip.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }

  res.json(tips);
});

// Weather API (mock data)
router.get("/weather/:city", (req, res) => {
  const { city } = req.params;

  // Mock weather data
  const weather = {
    city: city,
    temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
    condition: ["Sunny", "Cloudy", "Rainy", "Clear"][
      Math.floor(Math.random() * 4)
    ],
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    forecast: [
      {
        day: "Today",
        temp: Math.floor(Math.random() * 20) + 20,
        condition: "Sunny",
      },
      {
        day: "Tomorrow",
        temp: Math.floor(Math.random() * 20) + 20,
        condition: "Cloudy",
      },
      {
        day: "Day 3",
        temp: Math.floor(Math.random() * 20) + 20,
        condition: "Clear",
      },
    ],
  };

  res.json(weather);
});

// Currency converter (mock data)
router.get("/currency/:from/:to/:amount", (req, res) => {
  const { from, to, amount } = req.params;

  // Mock exchange rates (INR as base)
  const rates = {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    INR: 1,
    AUD: 0.018,
    CAD: 0.016,
  };

  const fromRate = rates[from.toUpperCase()] || 1;
  const toRate = rates[to.toUpperCase()] || 1;
  const converted = (parseFloat(amount) / fromRate) * toRate;

  res.json({
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    amount: parseFloat(amount),
    converted: Math.round(converted * 100) / 100,
    rate: Math.round((toRate / fromRate) * 10000) / 10000,
  });
});

// Travel budget calculator
router.post("/budget", requireAuth, (req, res) => {
  const { destination, days, accommodation, transport, food, activities } =
    req.body;

  const budget = {
    destination,
    days: parseInt(days),
    breakdown: {
      accommodation: parseFloat(accommodation) * days,
      transport: parseFloat(transport),
      food: parseFloat(food) * days,
      activities: parseFloat(activities) * days,
    },
  };

  budget.total = Object.values(budget.breakdown).reduce(
    (sum, cost) => sum + cost,
    0
  );
  budget.perDay = budget.total / budget.days;

  res.json(budget);
});

export default router;
