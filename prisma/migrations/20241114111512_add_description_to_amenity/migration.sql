/*
  Warnings:

  - Added the required column `description` to the `Amenity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Amenity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No description provided' -- Voeg een standaardwaarde toe
);
INSERT INTO "new_Amenity" ("id", "name", "description") SELECT "id", "name", 'No description provided' FROM "Amenity"; -- Voeg de standaardwaarde toe aan bestaande rijen
DROP TABLE "Amenity";
ALTER TABLE "new_Amenity" RENAME TO "Amenity";
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;