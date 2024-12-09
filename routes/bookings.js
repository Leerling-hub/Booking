import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate token
router.use(authenticateToken);

// Fetch bookings with query parameters
router.get("/", async (req, res) => {
  try {
    const { bookingStatus, invalidParam } = req.query;

    // Validatie van queryparameters
    if (invalidParam || (bookingStatus && typeof bookingStatus !== "string")) {
      logger.error("Validation error: Invalid query parameters");
      return res.status(422).json({ error: "Invalid query parameters" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        bookingStatus: bookingStatus ? { contains: bookingStatus } : undefined,
      },
    });

    logger.info("Bookings fetched:", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    logger.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Maak een nieuwe booking aan
router.post("/", async (req, res) => {
  try {
    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
      userId,
      propertyId,
    } = req.body;

    logger.info("Creating new booking with data:", req.body);

    if (
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests ||
      !totalPrice ||
      !bookingStatus ||
      !userId ||
      !propertyId
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const booking = await prisma.booking.create({
      data: {
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
        userId,
        propertyId,
      },
    });

    logger.info("Booking created:", booking);
    res.status(201).json(booking);
  } catch (error) {
    logger.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Haal een enkele booking op
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching booking with ID:", id);
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      logger.warn("Booking not found with ID:", id);
      return res.status(404).json({ error: "Booking not found" });
    }

    logger.info("Booking found:", booking);
    res.status(200).json(booking);
  } catch (error) {
    logger.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update een booking
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
    userId,
    propertyId,
  } = req.body;

  try {
    logger.info("Updating booking with ID:", id);

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      logger.warn("Booking not found with ID:", id);
      return res.status(404).json({ error: "Booking not found" });
    }

    if (
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests ||
      !totalPrice ||
      !bookingStatus ||
      !userId ||
      !propertyId
    ) {
      logger.error("Validation error: All fields are required");
      return res.status(422).json({ error: "All fields are required" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
        userId,
        propertyId,
      },
    });

    logger.info("Booking updated successfully:", updatedBooking);
    res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verwijder een booking
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Deleting booking with ID:", id);

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      logger.warn("Booking not found with ID:", id);
      return res.status(404).json({ error: "Booking not found" });
    }

    await prisma.booking.delete({
      where: { id },
    });

    logger.info("Booking deleted successfully");
    res.status(204).end();
  } catch (error) {
    logger.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
