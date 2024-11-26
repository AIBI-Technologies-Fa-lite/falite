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

export const reporting = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query as { timeRange: string };

    // Calculate the start and end dates based on timeRange
    const now = new Date();
    let startDate, endDate, groupByField;

    if (timeRange === "daily") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      groupByField = "day"; // Group by day
    } else if (timeRange === "this-month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      groupByField = "week"; // Group by week
    } else if (timeRange === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      groupByField = "month"; // Group by month
    }

    // Fetch total verifications and completed verifications
    const totalVerifications = await prisma.verification.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const completedVerifications = await prisma.verification.count({
      where: {
        final: 1,
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalAssigned = await prisma.verification.groupBy({
      by: ["createdAt"], // Group by date field
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

    const totalCompleted = await prisma.verification.groupBy({
      by: ["updatedAt"], // Group by date field
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

    // Generate labels for the chart
    const labels =
      timeRange === "daily"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeRange === "this-month"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
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

    // Map the database results into chart data
    const totalAssignedData = labels.map((label, index) => {
      return totalAssigned[index]?._count.id || 0;
    });

    const totalCompletedData = labels.map((label, index) => {
      return totalCompleted[index]?._count.id || 0;
    });

    // Fetch distance covered (sum aggregation)
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
      totalVerifications,
      completedVerifications,
      distanceCovered: distanceCovered._sum.distance || 0,
      completedPercentage:
        Math.floor((completedVerifications / totalVerifications) * 100) || 0,
      labels,
      totalAssigned: totalAssignedData,
      totalCompleted: totalCompletedData
    };
    apiResponse.success(res, { data });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    // Ensure only one error response is sent
    apiResponse.error(res);
  }
};
