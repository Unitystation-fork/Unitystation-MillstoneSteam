import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const deleteTask = defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  const auth = event.req.headers.authorization;
  const token = auth !== undefined ? auth.split(" ")[1] : null;
  try {
    //check if id is given
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
      throw "You do not have the permission to delete tasks";
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
    // delete the task
    const deletedTask = await prisma.task.delete({
      where: {
        id: id,
      },
    });
    return {
      statusCode: 200,
      body: { message: "Task deleted", task: deletedTask },
    };
  } catch (e) {
    console.log(e);
    if (e.name === "JsonWebTokenError") {
      return { statusCode: 401, body: { error: "Invalid token" } };
    }
    if (e.name === "TokenExpiredError") {
      return { statusCode: 401, body: { error: "Expired token" } };
    }
    return {
      statusCode: 500,
      body: { message: "Task could not be edited", error: e },
    };
  }
});

export default deleteTask;