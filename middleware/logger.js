import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import express from "express";
import { PrismaClient } from "@prisma/client";

const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "debug", // Zorg ervoor dat het logniveau consistent is
  format: combine(colorize(), timestamp(), myFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat), // Gebruik dezelfde formattering voor de console
    }),
    new transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log", // Schrijf logbestanden in de logs map
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(timestamp(), myFormat), // Gebruik dezelfde formattering voor de logbestanden
    }),
    new transports.DailyRotateFile({
      level: "error",
      filename: "logs/error-%DATE%.log", // Schrijf logbestanden in de logs map
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(timestamp(), myFormat), // Gebruik dezelfde formattering voor de logbestanden
    }),
  ],
});

const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
};

// Express app en Prisma client initialiseren
const app = express();
const prisma = new PrismaClient();

app.use(requestLogger);
app.use(express.json());

// Route voor het ophalen van properties
app.get("/properties", async (req, res) => {
  try {
    const { location, pricePerNight, amenities } = req.query;
    const properties = await prisma.property.findMany({
      where: {
        location: location ? { contains: location } : undefined,
        pricePerNight: pricePerNight ? parseInt(pricePerNight) : undefined,
        amenities: amenities ? { contains: amenities } : undefined,
      },
    });
    if (properties.length === 0) {
      logger.info("No properties found for the given query parameters.");
    } else {
      logger.info(`Properties fetched: ${JSON.stringify(properties)}`);
    }
    res.status(200).json(properties);
  } catch (error) {
    logger.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { logger, requestLogger };
