import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Example protected route
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({ message: "Access granted", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
