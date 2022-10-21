import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();


const getUser = defineEventHandler((event) => {
    const user = prisma.user.findMany();
    return user;
});

export default getUser;