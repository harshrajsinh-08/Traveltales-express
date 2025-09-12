import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import User from "../models/User.js";

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

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      return res.render("signup", {
        error: "Database connection error.",
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

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      return res.render("login", {
        error: "Database connection error.",
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
    req.session.user = { id: user._id, name: user.name, email: user.email };
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
      };

      res.redirect("/");
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect("/login?error=oauth_callback_failed");
    }
  }
);

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
    if (req.logout && typeof req.logout === 'function') {
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
