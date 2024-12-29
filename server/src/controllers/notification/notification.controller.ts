import { Request, Response } from "express";
import prisma from "../../db";
import { apiResponse, CustomRequest } from "../../utils/response";
import { Status } from "@prisma/client";
export const readNotificaton = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });
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
        where: { userId: user.id, isRead: false }
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } })
    ]);

    apiResponse.success(res, { notifications }, { count: totalNotifications });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const getCounts = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;

  try {
    let whereClause: any = {};
    if (user.role === "SUPERVISOR") {
      // Extract branch IDs from user.branches
      const userBranchIds = user.branches.map(
        (branch: { id: number }) => branch.id
      );
      whereClause.of = {
        branches: {
          some: { id: { in: userBranchIds } }
        }
      };
    } else {
      whereClause.of_id = user.id;
    }
    // Fetch verifications with pagination

    const newVerification = await prisma.verification.count({
      where: { status: Status.PENDING, ...whereClause }
    });

    const pendingVerification = await prisma.verification.count({
      where: {
        status: { notIn: [Status.REJECTED, Status.PENDING] },
        ...whereClause
      }
    });

    const priorityVerification = await prisma.verification.count({
      where: { priority: true, final: 0, ...whereClause }
    });

    const workingVerification = await prisma.verification.count({
      where: { working: true, final: 0, ...whereClause }
    });

    // Send the response with pagination data
    apiResponse.success(res, {
      new: newVerification,
      pending: pendingVerification,
      priority: priorityVerification,
      working: workingVerification
    });
  } catch (error) {
    console.log(error);
    apiResponse.error(res);
  }
};
