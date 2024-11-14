import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import prisma from "../../db";
import { Role } from "@prisma/client";
export const captureLocation = async (req: Request, res: Response) => {
  const { lat, long } = req.body as { lat: number; long: number };
  const user = (req as CustomRequest).user;
  try {
    const start = await prisma.coordinates.create({
      data: {
        latitude: lat,
        longitude: long
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        start: {
          connect: {
            id: start.id
          }
        },
        working: true
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const resetLocation = async (req: Request, res: Response) => {
  const { lat, long } = req.body as { lat: number; long: number };
  const user = (req as CustomRequest).user;
  try {
    const start = await prisma.coordinates.create({
      data: {
        latitude: lat,
        longitude: long
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        start: {
          connect: {
            id: start.id
          }
        }
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const getCheckins = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;

  try {
    let whereClause: any = {
      organizationId: user.organizationId,
      role: Role.OF
    };
    if (user.role === Role.SUPERVISOR) {
      const userBranchIds = user.branches.map((branch: { id: number }) => branch.id);
      whereClause = {
        ...whereClause,
        branches: {
          some: { id: { in: userBranchIds } }
        }
      };
    } else if (user.role === Role.CRE) {
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        start: true,
        verifications: {
          where: {
            updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(24, 0, 0, 0)) },
            final: 1
          },
          select: {
            id: true,
            destination: true,
            distance: true
          }
        },
        location: {
          select: {
            latitude: true,
            longitude: true,
            updatedAt: true
          }
        }
      }
    });
    const usersWithDistanceSum = users.map((user) => {
      const { distanceSum, checkins } = user.verifications.reduce(
        (acc, verification) => {
          return { distanceSum: acc.distanceSum + (verification.distance ? verification.distance : 0), checkins: acc.checkins + 1 };
        },
        { distanceSum: 0, checkins: 0 }
      );
      return { ...user, distance: distanceSum, checkins };
    });
    apiResponse.success(res, { users: usersWithDistanceSum });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
