import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { logger } from "../middleware/logger.js";

const prisma = new PrismaClient();

export async function seedDatabase() {
  logger.info("Seeding database...");

  try {
    // Voeg meerdere gebruikers toe
    for (let i = 0; i < 50; i++) {
      await prisma.user.create({
        data: {
          id: `user-id-${i}`,
          username: `user${i}`,
          password: await bcrypt.hash("password123", 10),
          name: `User ${i}`,
          email: `user${i}@example.com`, // Zorg ervoor dat elk e-mailadres uniek is
          phoneNumber: `123-456-789${i}`,
          profilePicture: `https://example.com/user${i}.jpg`,
        },
      });
    }
    logger.info("Users seeded.");

    // Voeg meerdere hosts toe
    for (let i = 0; i < 10; i++) {
      await prisma.host.create({
        data: {
          id: `host-id-${i}`,
          username: `host${i}`,
          password: await bcrypt.hash("password123", 10),
          name: `Host ${i}`,
          email: `host${i}@example.com`, // Zorg ervoor dat elk e-mailadres uniek is
          phoneNumber: `123-456-789${i}`,
          profilePicture: `https://example.com/host${i}.jpg`,
          aboutMe: `About Host ${i}`,
          user: {
            connect: { id: `user-id-${i}` },
          },
        },
      });
    }
    logger.info("Hosts seeded.");

    // Voeg meerdere properties toe
    for (let i = 0; i < 20; i++) {
      await prisma.property.create({
        data: {
          id: `property-id-${i}`,
          title: `Property ${i}`,
          description: `Description for Property ${i}`,
          location: `Location ${i}`,
          pricePerNight: parseFloat((Math.random() * 100 + 50).toFixed(2)),
          bedroomCount: Math.floor(Math.random() * 5) + 1,
          bathroomCount: Math.floor(Math.random() * 3) + 1,
          maxGuestCount: Math.floor(Math.random() * 10) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          host: {
            connect: { id: `host-id-${i % 10}` },
          },
        },
      });
    }
    logger.info("Properties seeded.");

    // Voeg meerdere amenities toe
    for (let i = 0; i < 10; i++) {
      await prisma.amenity.create({
        data: {
          id: `amenity-id-${i}`,
          name: `Amenity ${i}`,
          description: `Description for Amenity ${i}`, // Voeg de description veld toe
        },
      });
    }
    logger.info("Amenities seeded.");

    // Voeg meerdere bookings toe
    for (let i = 0; i < 50; i++) {
      const checkinDate = new Date();
      checkinDate.setDate(
        checkinDate.getDate() + Math.floor(Math.random() * 30)
      );
      checkinDate.setHours(
        12 + Math.floor(Math.random() * 7),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      const checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(
        checkoutDate.getDate() + Math.floor(Math.random() * 7) + 1
      );
      checkoutDate.setHours(
        8 + Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      await prisma.booking.create({
        data: {
          id: `booking-id-${i}`,
          checkinDate: checkinDate,
          checkoutDate: checkoutDate,
          numberOfGuests: Math.floor(Math.random() * 5) + 1,
          totalPrice: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
          bookingStatus: "confirmed",
          user: {
            connect: { id: `user-id-${i % 50}` },
          },
          property: {
            connect: { id: `property-id-${i % 20}` },
          },
        },
      });
    }
    logger.info("Bookings seeded.");

    // Voeg meerdere reviews toe
    for (let i = 0; i < 50; i++) {
      await prisma.review.create({
        data: {
          id: `review-id-${i}`,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: `Review comment ${i}`,
          user: {
            connect: { id: `user-id-${i % 50}` },
          },
          property: {
            connect: { id: `property-id-${i % 20}` },
          },
        },
      });
    }
    logger.info("Reviews seeded.");

    logger.info("Database seeded successfully.");
  } catch (error) {
    logger.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
    logger.info("Prisma client disconnected.");
  }
}
