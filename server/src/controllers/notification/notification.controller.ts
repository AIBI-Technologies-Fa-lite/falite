import { Request, Response } from "express";
import prisma from "../../db";
import { apiResponse } from "../../utils/response";

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
