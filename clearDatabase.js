import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Functie om alle testdata uit de database te verwijderen.
 * Deze functie verwijdert alle records uit de tabellen: review, amenity, booking, property, host en user.
 */
async function clearDatabase() {
  try {
    await prisma.review.deleteMany({});
    await prisma.amenity.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.host.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Testdata succesvol opgeruimd!");
  } catch (err) {
    console.error("Fout bij het opruimen van testdata:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Roep de functie aan om de database op te schonen
clearDatabase();
