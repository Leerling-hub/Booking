import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch hosts with query parameters
router.get("/", async (req, res) => {
  try {
    const { name, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (name && typeof name !== "string")) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const hosts = await prisma.host.findMany({
      where: {
        name: name ? { contains: name } : undefined,
      },
    });

    logger.info("Hosts fetched:", hosts);
    res.status(200).json(hosts);
  } catch (error) {
    logger.error("Error fetching hosts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe host aan
router.post("/", async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
      userId,
    } = req.body;

    logger.info("Creating new host with data:", req.body);

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture ||
      !aboutMe ||
      !userId
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const host = await prisma.host.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
        userId,
      },
    });

    logger.info("Host created:", host);
    res.status(201).json(host);
  } catch (error) {
    logger.error("Error creating host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele host op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching host with ID:", id);
    const host = await prisma.host.findUnique({
      where: { id },
    });

    if (!host) {
      logger.warn("Host not found with ID:", id);
      return res.status(404).json({ error: "Host not found" });
    }

    logger.info("Host found:", host);
    res.status(200).json(host);
  } catch (error) {
    logger.error("Error fetching host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een host
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    name,
    email,
    phoneNumber,
    profilePicture,
    aboutMe,
  } = req.body;

  try {
    logger.info("Updating host with ID:", id);

    const host = await prisma.host.findUnique({ where: { id } });

    if (!host) {
      logger.warn("Host not found with ID:", id);
      return res.status(404).json({ error: "Host not found" });
    }

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture ||
      !aboutMe
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedHost = await prisma.host.update({
      where: { id },
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      },
    });

    logger.info("Host updated successfully:", updatedHost);
    res.status(200).json(updatedHost);
  } catch (error) {
    logger.error("Error updating host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een host
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting host with ID:", id);

    const host = await prisma.host.findUnique({ where: { id } });

    if (!host) {
      logger.warn("Host not found with ID:", id);
      return res.status(404).json({ error: "Host not found" });
    }

    await prisma.host.delete({
      where: { id },
    });

    logger.info("Host deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting host:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
