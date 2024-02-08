-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "token" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "discordId" TEXT,
    "twitchId" TEXT
);
INSERT INTO "new_User" ("createdAt", "discordId", "id", "name", "password", "role", "token", "twitchId", "updatedAt") SELECT "createdAt", "discordId", "id", "name", "password", "role", "token", "twitchId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
