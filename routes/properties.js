import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch properties with query parameters
router.get("/", async (req, res) => {
  try {
    const { location, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (location && typeof location !== "string")) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const properties = await prisma.property.findMany({
      where: {
        location: location ? { contains: location } : undefined,
      },
    });

    logger.info("Properties fetched:", properties);
    res.status(200).json(properties);
  } catch (error) {
    logger.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe property aan
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathroomCount,
      maxGuestCount,
      rating,
      hostId,
    } = req.body;

    logger.info("Creating new property with data:", req.body);

    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathroomCount ||
      !maxGuestCount ||
      !rating ||
      !hostId
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathroomCount,
        maxGuestCount,
        rating,
        hostId,
      },
    });

    logger.info("Property created:", property);
    res.status(201).json(property);
  } catch (error) {
    logger.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele property op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching property with ID:", id);
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      logger.warn("Property not found with ID:", id);
      return res.status(404).json({ error: "Property not found" });
    }

    logger.info("Property found:", property);
    res.status(200).json(property);
  } catch (error) {
    logger.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een property
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathroomCount,
    maxGuestCount,
    rating,
    hostId,
  } = req.body;

  try {
    logger.info("Updating property with ID:", id);

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      logger.warn("Property not found with ID:", id);
      return res.status(404).json({ error: "Property not found" });
    }

    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathroomCount ||
      !maxGuestCount ||
      !rating ||
      !hostId
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathroomCount,
        maxGuestCount,
        rating,
        hostId,
      },
    });

    logger.info("Property updated successfully:", updatedProperty);
    res.status(200).json(updatedProperty);
  } catch (error) {
    logger.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een property
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting property with ID:", id);

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      logger.warn("Property not found with ID:", id);
      return res.status(404).json({ error: "Property not found" });
    }

    await prisma.property.delete({
      where: { id },
    });

    logger.info("Property deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
