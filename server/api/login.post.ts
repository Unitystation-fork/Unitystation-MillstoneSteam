import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';


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
    const token = jwt.sign({id: user.id}, "shhhhhhh", {expiresIn : "5h"});
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
           token
        },
    });
    return {
        statusCode: 200,
        body: {message: 'Login successful', token: token},
    };
});

export default login;