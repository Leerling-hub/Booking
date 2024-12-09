import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Haalt een overzicht van de database op.
 *
 * Deze functie haalt alle records op uit de tabellen: user, host, property, booking, review en amenity.
 * De opgehaalde gegevens worden naar de console gelogd.
 */
async function getDatabaseOverview() {
  try {
    const users = await prisma.user.findMany();
    const hosts = await prisma.host.findMany();
    const properties = await prisma.property.findMany();
    const bookings = await prisma.booking.findMany();
    const reviews = await prisma.review.findMany();
    const amenities = await prisma.amenity.findMany();

    console.log("Users:", users);
    console.log("Hosts:", hosts);
    console.log("Properties:", properties);
    console.log("Bookings:", bookings);
    console.log("Reviews:", reviews);
    console.log("Amenities:", amenities);
  } catch (error) {
    console.error("Error fetching database overview:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Roep de functie aan om een overzicht van de database op te halen
getDatabaseOverview();
