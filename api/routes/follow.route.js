import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createFollow,
  deleteFollow,
  getFollowStatus,
  getFollowers,
  getFollowing
} from "../controllers/follow.controller.js";

const router = express.Router();

// Create a new follow relationship
router.post("/", verifyToken, createFollow);

// Delete a follow relationship (unfollow)
router.delete("/:id", verifyToken, deleteFollow);

// Check if user is following another user
router.get("/status/:id", verifyToken, getFollowStatus);

// Get all followers of a user
router.get("/followers/:id", getFollowers);

// Get all users that a user is following
router.get("/following/:id", getFollowing);

export default router;