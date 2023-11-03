import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkDiscordUserExistence = async (discordId) => {
    const user = await prisma.user.findUnique({
        where: {
            discordId,
        },
    });

    return user;
};