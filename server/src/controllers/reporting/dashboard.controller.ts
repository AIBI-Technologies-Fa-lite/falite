import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { Role } from "@prisma/client";
import {
  getDateRangeForCurrentMonth,
  getDateRangeForToday
} from "../../utils/time";
import prisma from "../../db";

export const getVerificationsCount = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;

  try {
    const { startOfMonth, endOfMonth } = getDateRangeForCurrentMonth();
    const { startOfDay, endOfDay } = getDateRangeForToday();
    if (user.role === Role.OF) {
      // Queries for verifications
      const [
        completedVerifications,
        totalVerifications,
        pendingVerifications,
        completedToday,
        assignedToday
      ] = await Promise.all([
        prisma.verification.count({
          where: {
            of_id: user.id,
            final: 1,
            case: {
              final: 1
            },
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.verification.count({
          where: {
            of_id: user.id,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.verification.count({
          where: {
            of_id: user.id,
            final: 0
          }
        }),
        prisma.verification.count({
          where: {
            of_id: user.id,
            final: 1,
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        prisma.verification.count({
          where: {
            of_id: user.id,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);

      // Send success response
      apiResponse.success(res, {
        monthly: { completedVerifications, totalVerifications },
        daily: { pendingVerifications, completedToday, assignedToday }
      });
    } else {
      const userBranchIds = user.branches.map(
        (branch: { id: number }) => branch.id
      );
      const [
        completedVerifications,
        totalVerifications,
        pendingVerifications,
        completedToday,
        assignedToday
      ] = await Promise.all([
        prisma.verification.count({
          where: {
            of: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 1,
            case: {
              final: 1
            },
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.verification.count({
          where: {
            of: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.verification.count({
          where: {
            of: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 0
          }
        }),
        prisma.verification.count({
          where: {
            of: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 1,
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        prisma.verification.count({
          where: {
            of: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);

      apiResponse.success(res, {
        monthly: { completedVerifications, totalVerifications },
        daily: { pendingVerifications, completedToday, assignedToday }
      });
    }
  } catch (err) {
    console.error("Error fetching verifications:", err);
    apiResponse.error(res);
  }
};

export const getCaseCount = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;

  try {
    const { startOfMonth, endOfMonth } = getDateRangeForCurrentMonth();
    const { startOfDay, endOfDay } = getDateRangeForToday();

    const userBranchIds = user.branches.map(
      (branch: { id: number }) => branch.id
    );

    if (user.role === Role.OF) {
      // Queries for OF role
      const [
        completedCases,
        totalCases,
        pendingCases,
        completedToday,
        assignedToday
      ] = await Promise.all([
        prisma.commonData.count({
          where: {
            employeeId: user.id,
            final: 1,
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employeeId: user.id,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employeeId: user.id,
            final: 0
          }
        }),
        prisma.commonData.count({
          where: {
            employeeId: user.id,
            final: 1,
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employeeId: user.id,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);

      apiResponse.success(res, {
        monthly: { completedCases, totalCases },
        daily: { pendingCases, completedToday, assignedToday }
      });
    } else {
      // Queries for other roles based on branches
      const [
        completedCases,
        totalCases,
        pendingCases,
        completedToday,
        assignedToday
      ] = await Promise.all([
        prisma.commonData.count({
          where: {
            employee: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 1,
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employee: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employee: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 0
          }
        }),
        prisma.commonData.count({
          where: {
            employee: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            final: 1,
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        prisma.commonData.count({
          where: {
            employee: {
              branches: {
                some: { id: { in: userBranchIds } }
              }
            },
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);

      apiResponse.success(res, {
        monthly: { completedCases, totalCases },
        daily: { pendingCases, completedToday, assignedToday }
      });
    }
  } catch (err) {
    console.error("Error fetching case counts:", err);
    apiResponse.error(res);
  }
};
