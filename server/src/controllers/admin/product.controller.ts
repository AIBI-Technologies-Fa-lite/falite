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
export const getProducts = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    order = "desc"
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    order?: "asc" | "desc";
  };

  const user = (req as CustomRequest).user;
  let whereClause: any = {
    organizationId: user.organizationId,
    name: { contains: search }
  };

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        orderBy: {
          createdAt: order
        },
        skip: skipAmount,
        take: parseInt(limit)
      }),
      prisma.product.count({ where: whereClause })
    ]);
    if (!products || products.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalProducts / parseInt(limit));

    apiResponse.success(res, { products }, { pages });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: {
        id: parseInt(id)
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};
