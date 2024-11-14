import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import prisma from "../../db";
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
