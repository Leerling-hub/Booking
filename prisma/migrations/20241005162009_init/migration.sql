-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotst" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "abautMe" TEXT NOT NULL
);
INSERT INTO "new_Hotst" ("abautMe", "email", "id", "name", "password", "phoneNumber", "profilePicture", "username") SELECT "abautMe", "email", "id", "name", "password", "phoneNumber", "profilePicture", "username" FROM "Hotst";
DROP TABLE "Hotst";
ALTER TABLE "new_Hotst" RENAME TO "Hotst";
CREATE UNIQUE INDEX "Hotst_username_key" ON "Hotst"("username");
CREATE UNIQUE INDEX "Hotst_email_key" ON "Hotst"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
