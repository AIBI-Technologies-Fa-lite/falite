import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { Role, Status } from "@prisma/client";
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

export const reporting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { timeRange } = req.query as { timeRange: string };
    const now: Date = new Date();
    let startDate: Date;
    let endDate: Date;

    // Set start and end dates based on time range
    if (timeRange === "daily") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 6
      );
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "this-month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else {
      throw new Error("Invalid timeRange provided.");
    }

    // Fetch total verifications
    const positive: number = await prisma.verification.count({
      where: {
        status: Status.POSITIVE,
        final: 1,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Fetch completed verifications
    const negative: number = await prisma.verification.count({
      where: {
        final: 1,
        status: {
          in: [Status.CANNOTVERIFY, Status.UNTRACEBLE, Status.NEGATIVE]
        },
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Group total verifications by the specified field
    const totalAssigned = await prisma.verification.groupBy({
      by: ["createdAt"], // Replace with appropriate grouping field if needed
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    // Group completed verifications by the specified field
    const totalCompleted = await prisma.verification.groupBy({
      by: ["updatedAt"], // Replace with appropriate grouping field if needed
      _count: {
        id: true
      },
      where: {
        final: 1,
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        updatedAt: "asc"
      }
    });

    totalCompleted;

    // Generate labels based on the time range
    const labels: string[] =
      timeRange === "daily"
        ? Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(now.getDate() - 6 + i);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          })
        : timeRange === "this-month"
        ? Array.from({ length: now.getDate() }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
            return `${date.getDate()}`;
          })
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ];

    // Map total assigned data to labels
    const totalAssignedData: number[] = labels.map((label) => {
      const totalForLabel = totalAssigned
        .filter((group) => {
          const groupDate = new Date(group.createdAt);
          const groupLabel =
            timeRange === "daily"
              ? `${groupDate.getDate()}/${groupDate.getMonth() + 1}`
              : timeRange === "this-month"
              ? `${groupDate.getDate()}`
              : [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ][groupDate.getMonth()];

          return groupLabel === label;
        })
        .reduce((sum, group) => sum + group._count.id, 0); // Sum all matching counts for the label

      return totalForLabel;
    });

    // Map total completed data to labels
    const totalCompletedData: number[] = labels.map((label) => {
      const totalForLabel = totalCompleted
        .filter((group) => {
          const groupDate = new Date(group.updatedAt);
          const groupLabel =
            timeRange === "daily"
              ? `${groupDate.getDate()}/${groupDate.getMonth() + 1}`
              : timeRange === "this-month"
              ? `${groupDate.getDate()}`
              : [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ][groupDate.getMonth()];

          return groupLabel === label;
        })
        .reduce((sum, group) => sum + group._count.id, 0); // Sum all matching counts for the label

      return totalForLabel;
    });

    // Aggregate distance covered
    const distanceCovered = await prisma.verification.aggregate({
      _sum: {
        distance: true
      },
      where: {
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Response data
    const data = {
      positive,
      negative,
      labels,
      totalAssigned: totalAssignedData,
      totalCompleted: totalCompletedData
    };

    // Send response
    apiResponse.success(res, { data });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    apiResponse.error(res);
  }
};
