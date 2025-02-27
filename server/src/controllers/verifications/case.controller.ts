import prisma from "../../db";
import { CreateCase } from "../../dto";
import { CustomRequest } from "../../utils/response";
import { Request, Response } from "express";
import { NotificationType, Status } from "@prisma/client";
import { apiResponse } from "../../utils/response";
import { Role } from "@prisma/client";
import { getFile } from "../../utils/documents";
import { sendNotification } from "../../utils/notification";
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
export const getCases = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    searchColumn = "",
    status = "",
    order = "desc",
    final = "0"
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    searchColumn?: "caseNumber" | "applicantName";
    status: "" | "ASSIGN" | "PENDING" | "REVIEW" | "CANNOTVERIFY" | "POSITIVE" | "NEGATIVE" | "REFER" | "REASSIGN";
    final?: string;
    order?: "asc" | "desc";
  };

  const user = (req as CustomRequest).user;
  let whereClause: any = {};
  whereClause.final = parseInt(final);
  if (searchColumn === "caseNumber") {
    whereClause.caseNumber = { contains: search };
  } else if (searchColumn === "applicantName") {
    whereClause.applicantName = { contains: search, mode: "insensitive" };
  }
  if (status) {
    whereClause.status = status;
  }
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
            },
            documents: {
              include: {
                employee: {
                  select: { role: true }
                }
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

    // Process each document to add the url field
    await Promise.all(
      caseData.verifications.map(async (verification) => {
        verification.documents = await Promise.all(
          verification.documents.map(async (document) => {
            const url = await getFile(document.name);
            return { ...document, url };
          })
        );
      })
    );

    apiResponse.success(res, { case: caseData });
  } catch (err) {
    apiResponse.error(res);
  }
};
export const closeCase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reworkRemarks } = req.body as { status: Status; reworkRemarks: string };

  try {
    let data: any = {
      status
    };
    if (status === Status.POSITIVE || status === Status.NEGATIVE) {
      data = {
        ...data,
        final: 1
      };
    } else {
      data = {
        ...data,
        final: 0
      };
    }
    if (reworkRemarks) {
      data = {
        ...data,
        reworkRemarks
      };
    }
    const updatedCase = await prisma.commonData.update({
      where: { id: parseInt(id) },
      data: data
    });
    apiResponse.success(res, {});
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
export const reworkCase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { supervisorRemarks } = req.body as { supervisorRemarks: string };

  try {
    const updatedCase = await prisma.commonData.update({
      where: { id: parseInt(id) },
      data: {
        supervisorRemarks: supervisorRemarks,
        status: Status.REWORK
      }
    });
    await sendNotification("Case Rework", updatedCase.employeeId, NotificationType.CASE, updatedCase.id);
    apiResponse.success(res, {});
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
export const markCompleted = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.commonData.update({ where: { id: parseInt(id) }, data: { final: 1 } });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};
