import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();


const login = defineEventHandler(async (event) => {
    const body = await readBody(event);
    const user = await prisma.user.findUnique({
        where: {
            name: body.name,
        }
    });
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if(!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'User not found'}),
        };
    }
    if(!isPasswordCorrect) {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Password is incorrect'}),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Login successful'}),
    };
});

export default login;