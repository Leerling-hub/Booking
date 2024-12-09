import { teardownDatabase } from "./prisma/teardownDatabase.js";
import { seedDatabase } from "./prisma/seed.js";

/**
 * Reset de database door alle records te verwijderen en opnieuw te seeden.
 *
 * Deze functie roept eerst `teardownDatabase` aan om alle records uit de database te verwijderen.
 * Vervolgens roept het `seedDatabase` aan om de database opnieuw te vullen met initiële data.
 */
async function main() {
  console.log("Resetting database...");
  await teardownDatabase();
  await seedDatabase();
  console.log("Database reset successfully.");
}

// Voer de main functie uit en handel eventuele fouten af
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
