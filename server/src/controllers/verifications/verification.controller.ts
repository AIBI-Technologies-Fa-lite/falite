import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateCase, CreateVerification } from "../../dto";
import prisma from "../../db";
import { Role, Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import path from "path";


export const createVerification = async (req: Request, res: Response) => {
  const { verificationData, caseId } = req.body as { verificationData: CreateVerification; caseId: number };

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
      // To Do
      // Step 3: Update Case Status to PENDING
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

export const getCases = async (req: Request, res: Response) => {
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
    searchColumn?: "name" | "branchCode";
    order?: "asc" | "desc";
  };

  const user = (req as CustomRequest).user;
  let whereClause: any = {};

  // Determine the filtering based on the user's role
  if (user.role === Role.CRE) {
    // If the user is a CRE, filter cases by employeeId
    whereClause.employeeId = user.id;
  } else {
    // Extract branch IDs from user.branches
    const userBranchIds = user.branches.map((branch: { id: number }) => branch.id);
    // If not a CRE, filter cases by overlapping branches between the employee and user
    whereClause.employee = {
      branches: {
        some: {
          id: {
            in: userBranchIds
          }
        }
      }
    };
  }

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [cases, totalCases] = await prisma.$transaction([
      prisma.commonData.findMany({
        where: whereClause,
        orderBy: { createdAt: order },
        skip: skipAmount,
        take: parseInt(limit),
        include: { employee: { select: { firstName: true, lastName: true } } }
      }),
      prisma.commonData.count({
        where: whereClause
      })
    ]);

    if (!cases || cases.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalCases / parseInt(limit));

    apiResponse.success(res, { cases }, { pages });
  } catch (err) {
    console.error(err);
    apiResponse.error(res);
  }
};
export const getCaseById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const caseId: number = parseInt(id);
    const caseData = await prisma.commonData.findUnique({
      where: { id: caseId },
      include: {
        verifications: {
          include: {
            verificationType: true,
            of: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        employee: {
          select: {
            firstName: true
          }
        }
      }
    });
    if (!caseData) {
      apiResponse.success(res, "Case Not Found");
      return;
    }
    apiResponse.success(res, { case: caseData });
  } catch (err) {
    apiResponse.error(res);
  }
};

export const getAllVerificationTypes = async (req: Request, res: Response) => {};
