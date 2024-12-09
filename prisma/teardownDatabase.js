import { PrismaClient } from "@prisma/client";
import winston from "winston";

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "application.log" }),
  ],
});

logger.info("Starting teardownDatabase.js script...");

export async function teardownDatabase() {
  logger.info("Tearing down database...");

  try {
    logger.info("Deleting reviews...");
    const deleteReviews = await prisma.review.deleteMany();
    logger.info(`Reviews deleted: ${deleteReviews.count}`);

    logger.info("Deleting bookings...");
    const deleteBookings = await prisma.booking.deleteMany();
    logger.info(`Bookings deleted: ${deleteBookings.count}`);

    logger.info("Deleting properties...");
    const deleteProperties = await prisma.property.deleteMany();
    logger.info(`Properties deleted: ${deleteProperties.count}`);

    logger.info("Deleting amenities...");
    const deleteAmenities = await prisma.amenity.deleteMany();
    logger.info(`Amenities deleted: ${deleteAmenities.count}`);

    logger.info("Deleting hosts...");
    const deleteHosts = await prisma.host.deleteMany();
    logger.info(`Hosts deleted: ${deleteHosts.count}`);

    logger.info("Deleting users...");
    const deleteUsers = await prisma.user.deleteMany();
    logger.info(`Users deleted: ${deleteUsers.count}`);

    logger.info("Database teardown completed");
  } catch (error) {
    logger.error("Error during database teardown:", error);
  } finally {
    await prisma.$disconnect();
    logger.info("Prisma client disconnected");
  }
}

// Voer de teardown uit als dit script direct wordt uitgevoerd
if (import.meta.url === `file://${process.argv[1]}`) {
  teardownDatabase().catch((e) => {
    logger.error(e);
    process.exit(1);
  });
}
