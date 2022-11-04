import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const createTask = defineEventHandler(async (event) => {
    // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const title = body.title;
  const content = body.content;
  // get the token from the request headers
  const auth = event.req.headers.authorization;
  const token = (auth !== undefined) ?  auth.split(" ")[1] : null;
  try {
    // verify the token and get the user id from it
    if(!token) {
        throw "No token provided";
    }
    const decoded :string | JwtPayload= jwt.verify(token, "shhhhhhh");
    if(!decoded) {
        throw "Invalid token";
    }
    // check if the user exists and throw an error if it doesn't
    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        }
    });
    if(!user) {
        throw "User not found";
    }
    //check if user is admin
    if(user.role !== "ADMIN") {
        throw "You do not have the permission to create tasks";
    }
    // create the task
    const task = await prisma.task.create({
      data: {
        title,
        content,
      },
    });
    console.log
    return {
      statusCode: 200,
      body: {message: "Task created", task: task},
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: { message: "Task could not be created", error: error },
    };
  }
});

export default createTask;