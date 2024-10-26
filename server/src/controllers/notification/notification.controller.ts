import { Request, Response } from "express";
import prisma from "../../db";
import { apiResponse, CustomRequest } from "../../utils/response";

export const readNotificaton = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({ where: { id: parseInt(id) }, data: { isRead: true } });
    apiResponse.success(res, {});
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  try {
    const [notifications, totalNotifications] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { userId: user.id }
      }),
      prisma.notification.count({ where: { userId: user.id } })
    ]);

    apiResponse.success(res, { notifications }, { count: totalNotifications });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
