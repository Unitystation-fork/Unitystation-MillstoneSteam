import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';


const login = defineEventHandler(async (event) => {
    // get the body of the request and asign its parameters to variables
    const body = await readBody(event);
    const name = body.name;
    const password = body.password;
    // get user from database
    const user = await prisma.user.findUnique({
        where: {
            name: name,
        }
    });
    // compare the password from the request with the password from the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // if user doesn't exist or password is incorrect, return an error
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
    // create a token with the user id
    const token = jwt.sign({id: user.id}, "shhhhhhh", {expiresIn : "5h"});
    // update the user with the token
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
           token
        },
    });
    // return the token
    return {
        statusCode: 200,
        body: {message: 'Login successful', token: token, role : user.role},
    };
});

export default login;