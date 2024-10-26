import { NotificationType } from "@prisma/client";
import prisma from "../db";

export const sendNotification = async (message: string, userId: number, type: NotificationType, id: number) => {
  try {
    await prisma.notification.create({ data: { user: { connect: { id: userId } }, type, message, linkTo: id } });
  } catch (err) {
    console.log(err);
  }
};
