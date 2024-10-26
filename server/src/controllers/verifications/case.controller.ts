import prisma from "../../db";
import { CreateCase } from "../../dto";
import { CustomRequest } from "../../utils/response";
import { Request, Response } from "express";
import { Status } from "@prisma/client";
import { apiResponse } from "../../utils/response";
export const createCase = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  const caseData: CreateCase = req.body;
  try {
    const newCase = await prisma.commonData.create({
      data: { ...caseData, status: Status.ASSIGN, employee: { connect: { id: user.id } } },
      select: { id: true }
    });
    apiResponse.success(res, { case: newCase });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
