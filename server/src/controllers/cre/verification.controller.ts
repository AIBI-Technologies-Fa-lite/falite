import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateCase, CreateVerification } from "../../dto";
import prisma from "../../db";
import { Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import path from "path";
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

export const createVerification = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { verificationData, caseId } = req.body as { verificationData: CreateVerification; caseId: number };
  const user = (req as CustomRequest).user;

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      // Step 1: Create Verification record
      const verification = await tx.verification.create({
        data: {
          verificationType: {
            connect: {
              id: verificationData.verificationTypeId
            }
          },
          address: verificationData.address,
          pincode: verificationData.pincode,
          case: {
            connect: {
              id: caseId
            }
          },
          creRemarks: verificationData.creRemarks,
          of: {
            connect: {
              id: verificationData.of_id
            }
          },
          status: Status.PENDING
        },
        select: {
          id: true
        }
      });

      // Step 2: Upload files and create Document records

      await tx.commonData.update({
        where: {
          id: caseId
        },
        data: {
          status: Status.PENDING
        }
      });
      return verification;
    });

    apiResponse.success(res, { verification: transaction });
  } catch (err) {
    console.error("Transaction failed: ", err);
    apiResponse.error(res);
  }
};
