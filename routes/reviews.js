import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch reviews with query parameters
router.get("/", async (req, res) => {
  try {
    const { rating, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (rating && isNaN(Number(rating)))) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const reviews = await prisma.review.findMany({
      where: {
        rating: rating ? Number(rating) : undefined,
      },
    });

    logger.info("Reviews fetched:", reviews);
    res.status(200).json(reviews);
  } catch (error) {
    logger.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe review aan
router.post("/", async (req, res) => {
  try {
    const { rating, comment, userId, propertyId } = req.body;

    logger.info("Creating new review with data:", req.body);

    if (!rating || !comment || !userId || !propertyId) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        propertyId,
      },
    });

    logger.info("Review created:", review);
    res.status(201).json(review);
  } catch (error) {
    logger.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele review op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching review with ID:", id);
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      logger.warn("Review not found with ID:", id);
      return res.status(404).json({ error: "Review not found" });
    }

    logger.info("Review found:", review);
    res.status(200).json(review);
  } catch (error) {
    logger.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een review
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, comment, userId, propertyId } = req.body;

  try {
    logger.info("Updating review with ID:", id);

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      logger.warn("Review not found with ID:", id);
      return res.status(404).json({ error: "Review not found" });
    }

    if (!rating || !comment || !userId || !propertyId) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
        userId,
        propertyId,
      },
    });

    logger.info("Review updated successfully:", updatedReview);
    res.status(200).json(updatedReview);
  } catch (error) {
    logger.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een review
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting review with ID:", id);

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      logger.warn("Review not found with ID:", id);
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({
      where: { id },
    });

    logger.info("Review deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
