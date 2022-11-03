import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getTasks = defineEventHandler(async (event) => {
    try{
        const tasks = await prisma.task.findMany({});
        return {
            statusCode: 200,
            body: JSON.stringify(tasks),
        };
    }catch(error){
        return {
            statusCode: 500,
            body: {message: "Tasks could not be found", error: error},
        }
    }
});

export default getTasks;