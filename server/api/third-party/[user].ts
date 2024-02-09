import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const user = getRouterParam(event, "user");
  try {
    const discordUser = await prisma.user.findUnique({
      where: {
        name: user,
      },
    });

    if (discordUser) {
      return {
        // Discord/Twitch user found
        statusCode: 200,
      };
    } else {
      return {
        // Discord/Twitch user not found
        statusCode: 400,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
    };
  }
});
