/*  Warnings:  - A unique constraint covering the columns `[userId,propertyId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.*/

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_propertyId_key" ON "Review"("userId", "propertyId");

-- Voeg de regels toe voor `naam` kolommen met standaardwaarden
ALTER TABLE "Host" ADD COLUMN "naam" TEXT NOT NULL DEFAULT 'Default Host Name';
ALTER TABLE "User" ADD COLUMN "naam" TEXT NOT NULL DEFAULT 'Default User Name';
