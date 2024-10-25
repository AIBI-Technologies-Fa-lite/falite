import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateCase } from "../../dto";
import prisma from "../../db";
import { Status } from "@prisma/client";
export const createCase = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  const caseData: CreateCase = req.body;
  try {
    const newCase = await prisma.commonData.create({
      data: { ...caseData, status: Status.PENDING, employee: { connect: { id: user.id } } },
      select: { id: true }
    });
    apiResponse.success(res, { case: newCase });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
