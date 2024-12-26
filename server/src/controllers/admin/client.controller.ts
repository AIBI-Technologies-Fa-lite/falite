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
export const getAllClients = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  try {
    const clients = await prisma.client.findMany({
      where: {
        organizationId: user.organizationId
      }
    });
    if (!clients || clients.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    apiResponse.success(res, { clients });
  } catch (err) {
    apiResponse.error(res);
  }
};
export const getClients = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    searchColumn = "",
    order = "desc"
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    searchColumn?: "name" | "clientCode";
    order?: "asc" | "desc";
  };

  const user = (req as CustomRequest).user;
  let whereClause: any = {
    organizationId: user.organizationId
  };

  if (searchColumn === "name") {
    whereClause = { ...whereClause, name: { contains: search } };
  } else {
    whereClause = {
      ...whereClause,
      code: { contains: search }
    };
  }

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [clients, totalClients] = await prisma.$transaction([
      prisma.client.findMany({
        where: whereClause,
        orderBy: {
          createdAt: order
        },
        skip: skipAmount,
        take: parseInt(limit)
      }),
      prisma.client.count({ where: whereClause })
    ]);
    if (!clients || clients.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalClients / parseInt(limit));

    apiResponse.success(res, { clients }, { pages });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.client.delete({
      where: {
        id: parseInt(id)
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};
