import { apiResponse, CustomRequest, statusCode } from "../../utils/response";
import { Request, Response } from "express";
import { CreateBranch } from "../../dto";
import prisma from "../../db";

export const createBranch = async (req: Request, res: Response) => {
  const { branch } = req.body as { branch: CreateBranch };
  const user = (req as CustomRequest).user;
  try {
    const newBranch = await prisma.branch.create({
      data: {
        name: branch.name,
        code: branch.code as string,
        organization: {
          connect: {
            id: user.organizationId
          }
        }
      }
    });
    apiResponse.success(res, { branch: newBranch });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
export const getAllBranches = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  try {
    const branches = await prisma.branch.findMany({
      where: {
        organizationId: user.organizationId
      }
    });
    if (!branches || branches.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    apiResponse.success(res, { branches });
  } catch (err) {
    apiResponse.error(res);
  }
};
export const getBranches = async (req: Request, res: Response) => {
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
    searchColumn?: "branchName" | "branchCode";
    order?: "asc" | "desc";
  };

  const user = (req as CustomRequest).user;
  let whereClause: any = {
    organizationId: user.organizationId
  };

  if (searchColumn === "branchName") {
    whereClause = { ...whereClause, name: { contains: search } };
  } else {
    whereClause = {
      ...whereClause,
      code: { contains: search }
    };
  }

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [branches, totalBranches] = await prisma.$transaction([
      prisma.branch.findMany({
        where: whereClause,
        orderBy: {
          createdAt: order
        },
        skip: skipAmount,
        take: parseInt(limit)
      }),
      prisma.branch.count({ where: whereClause })
    ]);
    if (!branches || branches.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalBranches / parseInt(limit));

    apiResponse.success(res, { branches }, { pages });
  } catch (err) {
    apiResponse.error(res);
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.branch.delete({
      where: {
        id: parseInt(id)
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};
