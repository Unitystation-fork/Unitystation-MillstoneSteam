import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const editTask = defineEventHandler(async (event) => {
  // get id from the request parameters
  const id = parseInt(event.context.params.id);
  // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const title : string = body.title ? body.title : null;
  const content : string = body.content ? body.content : null;
  const completed : boolean  = body.completed;
  const isContentPrivate : boolean = body.isContentPrivate;
  //get the token from the request headers
  const auth = event.req.headers.authorization;
  const token = auth !== undefined ? auth.split(" ")[1] : null;
  try {
    //check if task id is given
    if (!id) {
      throw "No id provided";
    }
    // verify the token and get the user id from it
    if (!token) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded === "string") {
      throw "Invalid token";
    }
    // check if the user exists and throw an error if it doesn't
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw "User not found";
    }
    //check if user is admin
    if (user.role !== "ADMIN") {
      throw "You do not have the permission to edit tasks";
    }
    // check if the task exists and throw an error if it doesn't
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      throw "Task does not exist";
    }
    // update the task with infos from the request body if they are not null
    // if they are null, the task will be updated with actual values
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title: title ? title : task.title,
        content: content ? content : task.content,
        completed: completed,
        isContentPrivate: isContentPrivate,
        updatedAt: new Date(),
      },
    });
    return {
      statusCode: 200,
      body: { message: "Task updated", task: updatedTask },
    };
  } catch (e) {
    console.log(e);
    if(e.name ==="JsonWebTokenError"){
      return { statusCode: 401, body: { error: "Invalid token" } };
    }
    if(e.name==="TokenExpiredError"){
      return { statusCode: 401, body: { error: "Expired token" } };
     }
    return {
      statusCode: 500,
      body: { message: "Task could not be edited", error: e },
    };
  }
});

export default editTask;