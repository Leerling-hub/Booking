import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js"; // Importeer de logger

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Token missing");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Token verified:", user);

    const dbUser = await prisma.user.findUnique({
      where: { username: user.username },
    });
    logger.info("User found in database:", dbUser);

    if (!dbUser) {
      logger.warn("User not found in database");
      return res.status(403).json({ error: "User not found" });
    }

    req.user = dbUser;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      logger.error("Token verification failed:", err);
      return res.status(403).json({ error: "Failed to authenticate token" });
    } else {
      logger.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
  } finally {
    await prisma.$disconnect(); // Zorg ervoor dat de Prisma-client wordt afgesloten
  }
};
