import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const deleteTask = defineEventHandler(async (event) => {
    const id = parseInt(event.context.params.id);
    const token = event.req.headers.authorization.split(" ")[1];
    try{
        //check if id is given
        if(!id) {
            throw "No id provided";
        }
        // verify the token and get the user id from it
        if (!token) {
            throw "No token provided";
        }
        const decoded: string | JwtPayload = jwt.verify(token, "shhhhhhh");
        if (!decoded) {
            throw "Invalid token";
        }
        // check if the user exists and throw an error if it doesn't
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            }
        });
        if (!user) {
            throw "You do not have permission to delete a task";
        }
        // check if the task exists and throw an error if it doesn't
        const task = await prisma.task.findUnique({
            where: {
                id: id,
            }
        });
        if(!task) {
            throw "Task does not exist";
        }
        // delete the task
        const deletedTask = await prisma.task.delete({
            where: {
                id: id,
            }
        });
        return {
            statusCode: 200,
            body: {message: "Task deleted", task: deletedTask},
        }
    } catch(error) {
        console.log(error);
        return {
            statusCode: 500,
            body: {message: "Task could not be deleted", error: error},
        }
    }
});

export default deleteTask;