import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getTasks = defineEventHandler(async (event) => {
    try{
        const tasks = await prisma.task.findMany({});
        console.log(tasks);
        return {
            statusCode: 200,
            body: {tasks},
        };
    }catch(error){
        return {
            statusCode: 500,
            body: {message: "Tasks could not be found", error: error},
        }
    }
});

export default getTasks;