const { PrismaClient } = require('@prisma/client');

async function listUsers() {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany();
    console.log('Liste des utilisateurs :', users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
