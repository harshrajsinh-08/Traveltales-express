import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDB } from "../utils/database.js";

const router = express.Router();

/* ------------------------
   LOCAL SIGNUP
------------------------ */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.render("signup", {
        error: "All fields are required",
        success: null,
      });
    }

    // Ensure database connection
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res.render("signup", {
        error: "Database connection error. Please try again.",
        success: null,
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        error: "User already exists",
        success: null,
      });
    }

    // Create user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.render("signup", {
      success: "Account created! Please login.",
      error: null,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.render("signup", {
      error: "Server error, please try again.",
      success: null,
    });
  }
});

/* ------------------------
   LOCAL LOGIN
------------------------ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.render("login", {
        error: "Email and password are required",
        success: null,
      });
    }

    // Ensure database connection
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res.render("login", {
        error: "Database connection error. Please try again.",
        success: null,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
        success: null,
      });
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.render("login", {
        error: "Please sign in with Google",
        success: null,
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.render("login", {
        error: "Invalid email or password",
        success: null,
      });
    }

    // Save user session info
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location
    };
    req.user = user;

    return res.redirect("/");
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.render("login", {
      error: "Server error during login",
      success: null,
    });
  }
});

/* ------------------------
   GOOGLE OAUTH
------------------------ */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=oauth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      // Save OAuth user info in session
      req.session.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
        bio: req.user.bio,
        location: req.user.location
      };

      res.redirect("/");
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect("/login?error=oauth_callback_failed");
    }
  }
);

/* ------------------------
   PROFILE EDITING
------------------------ */
router.get("/profile/edit", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    // Ensure database connection
    await connectDB();
    
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect("/login");
    }

    res.render("edit-profile", {
      error: null,
      success: null,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        location: user.location,
        website: user.website,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender
      },
    });
  } catch (err) {
    console.error("Profile Edit GET Error:", err.message);
    res.redirect("/profile");
  }
});

router.post("/profile/edit", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {
      name,
      bio,
      profileImage,
      location,
      website,
      phone,
      dateOfBirth,
      gender,
    } = req.body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Ensure database connection
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res
        .status(500)
        .json({ error: "Database connection error. Please try again." });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    user.name = name.trim();
    user.bio = bio ? bio.trim() : "";
    user.profileImage = profileImage || user.profileImage;
    user.location = location ? location.trim() : "";
    user.website = website ? website.trim() : "";
    user.phone = phone ? phone.trim() : "";
    user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    user.gender = gender || "";

    await user.save();

    // Update session with new user data
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
    };

    return res.json({
      success: "Profile updated successfully!",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    return res.status(500).json({ error: "Server error, please try again." });
  }
});

/* ------------------------
   LOGOUT
------------------------ */
router.get("/logout", (req, res) => {
  // Simple logout for GET requests
  req.session = null;
  res.redirect("/login");
});

router.post("/logout", (req, res) => {
  try {
    // Clear session
    req.session = null;

    // Clear any passport session
    if (req.logout && typeof req.logout === "function") {
      req.logout(() => {
        res.redirect("/login");
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error("Logout Error:", err);
    res.redirect("/login");
  }
});

export default router;
