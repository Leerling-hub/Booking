-- CreateTable
CREATE TABLE "Hotst" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "abautMe" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotst_email_key" ON "Hotst"("email");
