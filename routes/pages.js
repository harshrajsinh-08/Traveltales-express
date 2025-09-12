import express from "express";
import fs from "fs";
import path from "path" ;

const router = express.Router();

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if not authenticated
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

/* ------------------------
   PUBLIC ROUTES
------------------------ */
router.get("/login", (req, res) => {
  let error = null;
  if (req.query.error === "oauth_failed") {
    error = "Google authentication failed. Please try again.";
  } else if (req.query.error === "oauth_callback_failed") {
    error = "Authentication callback failed. Please try again.";
  }
  res.render("login", { error, success: null });
});
router.get("/signup", (req, res) =>
  res.render("signup", { error: null, success: null })
);
router.get("/privacy", (req, res) => res.render("privacy"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/debug", (req, res) => res.render("debug"));

/* ------------------------
   PROTECTED ROUTES
------------------------ */
router.get("/", requireLogin, (req, res) => {
  const stories = loadJSON("stories.json"); // ✅ Load featured travel stories
  const blogs = loadJSON("blogs.json"); // ✅ Load travel blogs

  res.render("index", {
    user: req.session.user,
    stories,
    blogs,
  });
});

router.get("/home", (req, res) => res.redirect("/")); // alias to home

router.get("/blogs", requireLogin, (req, res) => {
  const blogs = loadJSON("blogs.json"); // ✅ Load blogs for blogs page
  res.render("blogs", {
    user: req.session.user,
    blogs,
  });
});

router.get("/explore", requireLogin, (req, res) => {
  res.render("explore", { user: req.session.user });
});

// Wishlist page
router.get("/wishlist", requireLogin, (req, res) => {
  res.render("wishlist", { user: req.session.user });
});

// Travel tips page
router.get("/tips", requireLogin, (req, res) => {
  res.render("tips", { user: req.session.user });
});

// Weather page
router.get("/weather", requireLogin, (req, res) => {
  res.render("weather", { user: req.session.user });
});

router.get("/profile", requireLogin, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Profile JSON endpoint for dynamic loading
router.get("/profile.json", requireLogin, async (req, res) => {
  try {
    // Import User model and connectDB
    const { default: User } = await import("../models/User.js");
    const { connectDB } = await import("../utils/database.js");

    await connectDB();

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile data
    const profile = {
      name: user.name,
      email: user.email,
      bio:
        user.bio ||
        "Travel enthusiast exploring the world one destination at a time.",
      image:
        user.profileImage ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      location: user.location || "India",
      website: user.website || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || null,
      gender: user.gender || "",
      badges: user.badges || ["Explorer", "Photographer"],
      stats: {
        places: 12,
        posts: 8,
        followers: 156,
      },
      upcomingTrips: [
        { title: "Kerala Backwaters", date: "Dec 15, 2024" },
        { title: "Rajasthan Heritage Tour", date: "Jan 20, 2025" },
      ],
      recentActivity: [
        {
          icon: "bi-heart-fill",
          color: "text-red-500",
          text: "Liked a post about Goa beaches",
        },
        {
          icon: "bi-camera-fill",
          color: "text-blue-500",
          text: "Added photos from Manali trip",
        },
        {
          icon: "bi-geo-alt-fill",
          color: "text-green-500",
          text: "Checked in at Mumbai",
        },
      ],
      posts: [
        {
          title: "Amazing Sunset in Goa",
          description:
            "Witnessed the most beautiful sunset at Anjuna Beach. The colors were absolutely breathtaking!",
          image:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
          date: "Nov 28, 2024",
          likes: 24,
          comments: 8,
        },
        {
          title: "Trekking in Himachal",
          description:
            "Completed an amazing trek to Triund. The views of the Dhauladhar range were spectacular.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          date: "Nov 20, 2024",
          likes: 31,
          comments: 12,
        },
      ],
    };

    res.json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// Individual blog and story routes
router.get("/blog/:id", requireLogin, (req, res) => {
  const blogs = loadJSON("blogs.json");
  const blog = blogs.find((b) => b.id == req.params.id);

  if (!blog) {
    return res.status(404).render("404", { user: req.session.user });
  }

  res.render("blog-detail", { user: req.session.user, blog });
});

router.get("/story/:id", requireLogin, (req, res) => {
  const stories = loadJSON("stories.json");
  const story = stories.find((s) => s.id == req.params.id);

  if (!story) {
    return res.status(404).render("404", { user: req.session.user });
  }

  res.render("story-detail", { user: req.session.user, story });
});

export default router;
