import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Un jeton absent, invalide ou expiré ne bloque pas la page : le visiteur reste anonyme.
const isAuthenticated = (auth: string | undefined) => {
    try {
        jwt.verify(auth?.split(" ")[1] ?? "", process.env.JWT_SECRET!);
        return true;
    } catch {
        return false;
    }
};

const getTasks = defineEventHandler(async (event) => {
    try{
        const tasks = await prisma.task.findMany({});
        const visibleTasks = isAuthenticated(event.node.req.headers.authorization)
            ? tasks
            : tasks.map((task) => task.isContentPrivate ? {...task, content: ""} : task);
        return {
            statusCode: 200,
            body: {tasks: visibleTasks},
        };
    }catch(error){
        return {
            statusCode: 500,
            body: {message: "Tasks could not be found", error: error},
        }
    }
});

export default getTasks;