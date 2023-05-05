const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const tasks = [
  {
    title: "📄Pitch d'accoche, Pitch Minute",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: true,
    completed: true,
  },
  {
    title: "📄Press Kit",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title:
      "Rassembler une base de streamer et joueurs en une liste propre avec Job préférences",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "Canaux vocaux discord par département/zone",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "📄 Préparer une liste de règles et instructions streamer/viewer",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "Scène de streamer avec un tutoriel",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "Configurer un server local",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "Traduire la documentation (ajout de loi)",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "❓ Niveau Tutoriel Solo",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "❓ Tutoriel Français, Anglais, Allemand, Russe",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: true,
  },
  {
    title: "Annonces invitations de joueurs",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "📆 Doodle des participan",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "Lien multijoueur streamer",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: true,
    completed: false,
  },
  {
    title: "Entraînement twitch security ",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "Debriefing",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "🎙️ Voice Proximity Chat",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "Ajouter le rôle de streamer à la liste des rôles UnityStation",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "Ajouter une section FR sur le site de UnityStation",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
  {
    title: "Stream collaboratif",
    content: "Décrire le contenu de la tâche",
    isContentPrivate: false,
    completed: false,
  },
];

async function main() {
  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME,
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN",
    },
  });

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        content: task.content,
        isContentPrivate: task.isContentPrivate,
        completed: task.completed,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
