import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const editTask = defineEventHandler(async (event) => {
  // get id from the request parameters
  const id = parseInt(event.context.params.id);
  // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const title = body.title;
  const content = body.content;
  const completed = body.completed;

  //get the token from the request headers
  const token = event.req.headers.authorization.split(" ")[1];
  try {
    //check if task id is given
    if (!id) {
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
      },
    });
    if (!user) {
      throw "You do not have permission to create a task";
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
    // update the task
    const updatedTask = await prisma.task.update({
        where: {
            id: id,
        },
        data: {
            title,
            content,
            completed,
            updatedAt: new Date(),
        }
    });
    return {
        statusCode: 200,
        body: {message: "Task updated", task: updatedTask},
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: { message: "Task could not be edited", error: e },
    };
  }
});

export default editTask;
