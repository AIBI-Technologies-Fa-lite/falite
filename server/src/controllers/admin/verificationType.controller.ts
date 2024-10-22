import { apiResponse, CustomRequest } from "../../utils/response";
import { Request, Response } from "express";
import { CreateVerificationType } from "../../dto";
import prisma from "../../db";

export const createVerificationType = async (req: Request, res: Response) => {
  const { verificationType } = req.body as { verificationType: CreateVerificationType };
  const user = (req as CustomRequest).user;
  try {
    const newVerificationType = await prisma.verificationType.create({
      data: {
        name: verificationType.name,
        formId: verificationType.formId,
        organization: {
          connect: {
            id: user.organizationId
          }
        }
      }
    });
    apiResponse.success(res, { verificationType: newVerificationType });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const getVerificationTypes = async (req: Request, res: Response) => {
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
    deleted: false
  };
  if (search != "") {
    whereClause = {
      ...whereClause,
      name: {
        contains: search,
        mode: "insensitive"
      }
    };
  }

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [verificationTypes, totalVerificationTypes] = await prisma.$transaction([
      prisma.verificationType.findMany({
        where: whereClause,
        orderBy: {
          createdAt: order
        },
        skip: skipAmount,
        take: parseInt(limit)
      }),
      prisma.verificationType.count({ where: whereClause })
    ]);
    if (!verificationTypes || verificationTypes.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalVerificationTypes / parseInt(limit));

    apiResponse.success(res, { verificationTypes }, { pages });
  } catch (err) {
    apiResponse.error(res);
  }
};

export const deleteVerificationType = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.verificationType.update({ where: { id: parseInt(id) }, data: { deleted: true } });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};
