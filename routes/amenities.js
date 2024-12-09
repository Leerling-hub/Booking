import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch amenities with query parameters
router.get("/", async (req, res) => {
  try {
    const { name, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (name && typeof name !== "string")) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const amenities = await prisma.amenity.findMany({
      where: {
        name: name ? { contains: name } : undefined,
      },
    });

    logger.info("Amenities fetched:", amenities);
    res.status(200).json(amenities);
  } catch (error) {
    logger.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe amenity aan
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    logger.info("Creating new amenity with data:", req.body);

    if (!name || !description) {
      logger.error("Validation error: Name and description are required");
      return res
        .status(422)
        .json({ error: "Name and description are required" });
    }

    const amenity = await prisma.amenity.create({
      data: {
        name,
        description,
      },
    });

    logger.info("Amenity created:", amenity);
    res.status(201).json(amenity);
  } catch (error) {
    logger.error("Error creating amenity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele amenity op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching amenity with ID:", id);
    const amenity = await prisma.amenity.findUnique({
      where: { id },
    });

    if (!amenity) {
      logger.warn("Amenity not found with ID:", id);
      return res.status(404).json({ error: "Amenity not found" });
    }

    logger.info("Amenity found:", amenity);
    res.status(200).json(amenity);
  } catch (error) {
    logger.error("Error fetching amenity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een amenity
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    logger.info("Updating amenity with ID:", id);

    const amenity = await prisma.amenity.findUnique({ where: { id } });

    if (!amenity) {
      logger.warn("Amenity not found with ID:", id);
      return res.status(404).json({ error: "Amenity not found" });
    }

    if (!name || !description) {
      logger.error("Validation error: Name and description are required");
      return res
        .status(422)
        .json({ error: "Name and description are required" });
    }

    const updatedAmenity = await prisma.amenity.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    logger.info("Amenity updated successfully:", updatedAmenity);
    res.status(200).json(updatedAmenity);
  } catch (error) {
    logger.error("Error updating amenity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een amenity
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting amenity with ID:", id);

    const amenity = await prisma.amenity.findUnique({ where: { id } });

    if (!amenity) {
      logger.warn("Amenity not found with ID:", id);
      return res.status(404).json({ error: "Amenity not found" });
    }

    await prisma.amenity.delete({
      where: { id },
    });

    logger.info("Amenity deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting amenity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
