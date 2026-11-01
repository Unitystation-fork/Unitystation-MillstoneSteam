// Remplit prisma/milestone.db (déjà migrée) avec des comptes de test.
// Refuse de toucher une base qui contient déjà des utilisateurs, sauf FORCE=1.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
try {
  if ((await prisma.user.count()) > 0) {
    if (process.env.FORCE !== "1") {
      console.error("La base contient déjà des utilisateurs ; relancer avec FORCE=1 pour les remplacer.");
      process.exit(1);
    }
    await prisma.user.deleteMany();
  }
  const hash = await bcrypt.hash("secret123", 10);
  await prisma.user.create({ data: { name: "admin", password: hash, role: "ADMIN" } });
  await prisma.user.create({ data: { name: "alice", password: null, role: "USER" } });
  await prisma.user.create({ data: { name: "bob", password: null, role: "USER" } });
  console.log("base de test remplie : admin / alice / bob");
} finally {
  await prisma.$disconnect();
}
