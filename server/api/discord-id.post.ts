import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';


const prisma = new PrismaClient();

const discordHandler = defineEventHandler(async (event) => {
    if (event.node.req.method !== 'GET') {
        return event.node.res.status(405).end(); // Méthode non autorisée
    }

    const discordId = event.node.req.query.discordId as string;

    if (!discordId) {
        return event.node.res.status(400).json({ error: 'Paramètre discordId manquant' });
    }

    const user = await prisma.user.findUnique({
        where: {
            discordId: discordId,
        },
    });

    if (!user) {
        return event.node.res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    return event.node.res.status(200).json(user);
});

export default discordHandler;