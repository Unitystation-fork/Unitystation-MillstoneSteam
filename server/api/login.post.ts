import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';


const login = defineEventHandler(async (event) => {
    const body = await readBody(event);
    const name = body.name;
    const password = body.password;
    const user = await prisma.user.findUnique({
        where: {
            name: name,
        }
    });

    if(!user) {
        throw {
            statusCode: 401,
            statusMessage: 'Utilisateur inconnu.',
        };
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
        throw {
            statusCode: 401,
            statusMessage: 'Mot de passe incorrect.',
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
        body: {message: 'Login successful', token: token, role : user.role},
    };
});

export default login;