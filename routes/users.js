import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch users with query parameters
router.get("/", async (req, res) => {
  try {
    const { username, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (username && typeof username !== "string")) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const users = await prisma.user.findMany({
      where: {
        username: username ? { contains: username } : undefined,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        // Exclude password
        password: false,
      },
    });

    logger.info("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe user aan
router.post("/", async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;

    logger.info("Creating new user with data:", req.body);

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
      },
    });

    logger.info("User created:", user);
    res.status(201).json(user);
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele user op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching user with ID:", id);
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      logger.warn("User not found with ID:", id);
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("User found:", user);
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, name, email, phoneNumber, profilePicture } =
    req.body;

  try {
    logger.info("Updating user with ID:", id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      logger.warn("User not found with ID:", id);
      return res.status(404).json({ error: "User not found" });
    }

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
      },
    });

    logger.info("User updated successfully:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting user with ID:", id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      logger.warn("User not found with ID:", id);
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id },
    });

    logger.info("User deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
