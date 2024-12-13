import { Request, Response } from "express";
import prisma from "../../db";
import { apiResponse, CustomRequest } from "../../utils/response";

export const createClient = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  const { code, name } = req.body as { code: string; name: string };
  try {
    await prisma.client.create({
      data: {
        code,
        name,
        organization: {
          connect: {
            id: user.organizationId
          }
        }
      }
    });
    apiResponse.success(res, {});
  } catch (error) {
    console.log(error);
    apiResponse.error(res);
  }
};
