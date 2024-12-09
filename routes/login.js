import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { logger } from "../middleware/logger.js"; // Importeer de logger

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Validatie van invoerparameters
  if (!username || !password) {
    logger.error("Validation error: Username and password are required");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    logger.info("Attempting to find user with username:", username);
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      logger.warn("Invalid credentials for username:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Invalid credentials for username:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    logger.info("User authenticated successfully:", user);
    res.status(200).json({ token });
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
