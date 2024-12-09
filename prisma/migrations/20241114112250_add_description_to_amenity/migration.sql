-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Amenity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Amenity" ("description", "id", "name") SELECT "description", "id", "name" FROM "Amenity";
DROP TABLE "Amenity";
ALTER TABLE "new_Amenity" RENAME TO "Amenity";
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
