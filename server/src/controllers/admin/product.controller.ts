import prisma from "../../db";
import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";

export const createProduct = async (req: Request, res: Response) => {
  const { name } = req.body as { name: string };
  const user = (req as CustomRequest).user;

  try {
    await prisma.product.create({
      data: { name, organization: { connect: { id: user.organizationId } } }
    });

    apiResponse.success(res, {});
  } catch (error) {
    console.log(error);
    apiResponse.error(res);
  }
};
