/*  Warnings:  - You are about to drop the `_AmenityToProperty` table. If the table is not empty, all the data it contains will be lost. */

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AmenityToProperty";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_PropertyAmenities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PropertyAmenities_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PropertyAmenities_B_fkey" FOREIGN KEY ("B") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyAmenities_AB_unique" ON "_PropertyAmenities"("A", "B");
CREATE INDEX "_PropertyAmenities_B_index" ON "_PropertyAmenities"("B");

-- Add Columns with Defaults
ALTER TABLE "Amenity" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Default Amenity Name';
ALTER TABLE "Host" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Default Host Name';
ALTER TABLE "User" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Default User Name';
