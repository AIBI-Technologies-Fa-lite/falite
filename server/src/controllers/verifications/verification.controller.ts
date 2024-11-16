import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { calculateTat } from "../../utils/time";
import { bucket, directionsClient } from "../../config";
import prisma from "../../db";
import { NotificationType, Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { sendNotification } from "../../utils/notification";
import { getFile } from "../../utils/documents";

export const createVerification = async (req: Request, res: Response) => {
  const { verificationData, caseId } = req.body as { verificationData: any; caseId: string };
  const files = req.files as Express.Multer.File[];
  const user = (req as CustomRequest).user;
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      // Step 1: Create Verification record
      const verification = await tx.verification.create({
        data: {
          verificationType: {
            connect: {
              id: parseInt(verificationData.verificationTypeId, 10)
            }
          },
          address: verificationData.address,
          pincode: parseInt(verificationData.pincode, 10),
          case: {
            connect: {
              id: parseInt(caseId, 10)
            }
          },
          creRemarks: verificationData.creRemarks,
          of: {
            connect: {
              id: parseInt(verificationData.employeeId, 10)
            }
          },
          status: Status.PENDING
        },
        select: {
          id: true,
          of_id: true
        }
      });

      // Step 2: Upload files and create Document records
      for (const file of files) {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
          resumable: false
        });

        await new Promise<void>((resolve, reject) => {
          blobStream.on("finish", resolve).on("error", reject).end(file.buffer);
        });

        const publicUrl = `${fileName}`;
        await tx.document.create({
          data: {
            verification: {
              connect: {
                id: verification.id
              }
            },
            employee: {
              connect: {
                id: user.id
              }
            },
            name: publicUrl
          }
        });
      }
      // Step 3: Update Case Status to PENDING
      await tx.commonData.update({
        where: {
          id: parseInt(caseId)
        },
        data: {
          status: Status.PENDING
        }
      });

      await sendNotification("New Verification Assigned", verification.of_id, NotificationType.VERIFICATION, verification.id);
      return verification;
    });

    apiResponse.success(res, { verification: transaction });
  } catch (err) {
    console.error("Transaction failed: ", err);
    apiResponse.error(res);
  }
};
export const getVerifications = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  const {
    page = "1",
    limit = "10",
    search = "",
    searchColumn = "",
    status = "0",
    order = "desc"
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    searchColumn?: "clientName" | "creName" | "ofName" | "id";
    status?: string;
    order?: "asc" | "desc";
  };

  try {
    const pageNumber: number = parseInt(page, 10);
    const pageSize: number = parseInt(limit, 10);
    const skipAmount: number = (pageNumber - 1) * pageSize;
    const statusFilter: number = parseInt(status, 10);
    let whereClause: any = {};
    // Filter based on user role
    if (user.role === "SUPERVISOR") {
      // Extract branch IDs from user.branches
      const userBranchIds = user.branches.map((branch: { id: number }) => branch.id);
      whereClause.of = {
        branches: {
          some: { id: { in: userBranchIds } }
        }
      };
    } else {
      whereClause.of_id = user.id;
      whereClause.status = { not: Status.REJECTED };
    }

    // Search condition based on the search column
    if (search && searchColumn) {
      const empName = search.split(" ");
      switch (searchColumn) {
        case "clientName":
          whereClause.clientName = { contains: search, mode: "insensitive" };
          break;
        case "id":
          whereClause.id = parseInt(search, 10);
          break;
        case "creName":
        case "ofName":
          whereClause.case = {
            employee: {
              firstName: { contains: empName[0] || "", mode: "insensitive" },
              ...(empName[1] && { lastName: { contains: empName[1], mode: "insensitive" } })
            }
          };
          break;
        default:
          break;
      }
    }

    // Fetch verifications with pagination
    const verifications = await prisma.verification.findMany({
      where: whereClause,
      orderBy: { createdAt: order },
      include: {
        of: { select: { firstName: true, lastName: true } },
        case: {
          select: {
            employee: { select: { firstName: true, lastName: true } },
            product: true,
            clientName: true
          }
        },
        verificationType: true
      },
      take: pageSize,
      skip: skipAmount
    });

    // Calculate TAT for each verification
    const verificationsWithTAT = verifications.map((verification) => {
      const { createdAt, updatedAt, final } = verification;
      const tat = calculateTat(createdAt, updatedAt, final);
      return { ...verification, tat };
    });

    // Count total verifications for pagination
    const count = await prisma.verification.count({ where: whereClause });
    const totalPages = Math.ceil(count / pageSize);

    // Send the response with pagination data
    apiResponse.success(res, { verifications: verificationsWithTAT }, { pages: totalPages });
  } catch (err) {
    console.error("Error fetching verifications:", err);
    apiResponse.error(res, "An error occurred while fetching verifications.");
  }
};
export const getBillingVerifications = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  try {
    const verifications = await prisma.verification.findMany({
      where: { of: { organizationId: user.organizationId }, billable: false },
      include: {
        of: { select: { firstName: true, lastName: true } },
        case: {
          select: {
            employee: { select: { firstName: true, lastName: true } },
            product: true,
            clientName: true
          }
        },
        verificationType: true
      }
    });
    const count = await prisma.verification.count({ where: { of: { organizationId: user.organizationId }, billable: false } });
    const totalPages = Math.ceil(count / 10);
    apiResponse.success(res, { verifications }, { pages: totalPages });
  } catch (err) {
    console.error("Error fetching verifications:", err);
    apiResponse.error(res, "An error occurred while fetching verifications.");
  }
};
export const getVerificationById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const vid: number = parseInt(id);
    const verificationData = await prisma.verification.findUnique({
      where: { id: vid },
      include: {
        verificationType: {
          select: {
            name: true
          }
        },
        documents: {
          include: {
            employee: {
              select: { role: true }
            }
          }
        },
        of: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        case: {
          include: {
            employee: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!verificationData) {
      apiResponse.success(res, "Case Not Found");
      return;
    }

    // Process each document to add the url field
    await Promise.all(
      (verificationData.documents = await Promise.all(
        verificationData.documents.map(async (document) => {
          const url = await getFile(document.name);
          return { ...document, url };
        })
      ))
    );

    apiResponse.success(res, { verification: verificationData });
  } catch (err) {
    apiResponse.error(res);
  }
};
export const ofResponse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reject = false, remarks = null }: { reject?: boolean; remarks?: string | null } = req.body;
  try {
    if (reject) {
      const foundVerification = await prisma.verification.update({
        where: { id: parseInt(id) },
        data: { status: Status.REJECTED, feRemarks: remarks },
        include: { case: { select: { employeeId: true } } }
      });

      await prisma.commonData.update({ where: { id: foundVerification.caseId }, data: { status: Status.REASSIGN } });

      await sendNotification("Verification Rejected", foundVerification.case.employeeId, NotificationType.VERIFICATION, foundVerification.id);
      apiResponse.success(res, {});
    } else {
      await prisma.verification.update({ where: { id: parseInt(id) }, data: { status: Status.ONGOING } });
      apiResponse.success(res, {});
    }
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
export const markBilling = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { ofBillable, clientBillable } = req.body as { ofBillable: boolean; clientBillable: boolean };
  try {
    const verification = await prisma.verification.update({
      where: { id: parseInt(id) },
      data: {
        billable: true,
        clientBillable,
        ofBillable
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
  apiResponse.error(res);
  }
};
export const submitVerification = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { feRemarks, status, location, id } = req.body as {
    feRemarks: string;
    status: Status;
    location: { lat: string; long: string };
    id: any;
  };
  const user = (req as CustomRequest).user;

  try {
    // Start transaction with increased timeout
    const transaction = await prisma.$transaction(
      async (tx) => {
        // Step 1: Add New location
        const coords = await tx.coordinates.create({
          data: {
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.long)
          }
        });

        // Step 2: Calculate the distance (Parallelized with Step 3)
        const originPromise = tx.coordinates.findUnique({
          where: { id: user.startId }
        });

        // Step 3: Update Verification record
        const verificationPromise = tx.verification.update({
          where: { id: parseInt(id) },
          data: {
            feRemarks,
            status,
            destination: { connect: { id: coords.id } },
            final: 1 // Flag as completed
          },
          select: {
            id: true,
            case: { select: { id: true, employeeId: true } }
          }
        });

        // Await both promises in parallel
        const [origin, verification] = await Promise.all([originPromise, verificationPromise]);
        if (!origin) throw new Error("Origin coordinates not found");

        const response = await directionsClient
          .getDirections({
            waypoints: [{ coordinates: [origin.longitude, origin.latitude] }, { coordinates: [coords.longitude, coords.latitude] }],
            profile: "driving",
            geometries: "geojson"
          })
          .send();
        console.log(response.body);
        const distanceInMeters = response.body.routes[0]?.distance || 0;
        const distanceInKilometers = (distanceInMeters / 1000).toFixed(1);

        // Update verification with distance (uses a batch update for performance)
        await tx.verification.update({
          where: { id: parseInt(id) },
          data: {
            distance: parseFloat(distanceInKilometers)
          }
        });

        // Step 4: Check all verifications completed and update case status if needed
        const caseData = await tx.commonData.findUnique({
          where: { id: verification.case.id },
          include: { verifications: true }
        });

        const completed = caseData?.verifications.every((v) => v.final === 1);
        if (completed) {
          await tx.commonData.update({
            where: { id: verification.case.id },
            data: { status: Status.REVIEW }
          });
          sendNotification("Case Review", verification.case.employeeId, NotificationType.CASE, verification.case.id);
        }

        // Update user start location
        await tx.user.update({
          where: { id: user.id },
          data: { start: { connect: { id: coords.id } } }
        });

        return verification;
      },
      { timeout: 20000 }
    );

    // Step 5: Parallelize file uploads and document creation outside the transaction
    await Promise.all(
      files.map(async (file) => {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({ resumable: false });

        await new Promise<void>((resolve, reject) => {
          blobStream.on("finish", resolve).on("error", reject).end(file.buffer);
        });

        const publicUrl = `${fileName}`;
        await prisma.document.create({
          data: {
            verification: { connect: { id: transaction.id } },
            employee: { connect: { id: user.id } },
            name: publicUrl
          }
        });
      })
    );

    // Send final notification outside transaction to avoid delays
    sendNotification("Verification Completed", transaction.case.employeeId, NotificationType.CASE, transaction.case.id);

    // Respond with success status
    apiResponse.success(res, {});
  } catch (err) {
    console.error(err);
    apiResponse.error(res);
  }
};

export const reopenVerification = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { of_id } = req.body as { of_id: number };
  const user = (req as CustomRequest).user;
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const deleteDocs = await prisma.document.deleteMany({ where: { verificationId: parseInt(id), employeeId: { not: user.id } } });
      const updatedVerification = await tx.verification.update({
        where: { id: parseInt(id) },
        data: {
          of: {
            connect: { id: of_id }
          },
          feRemarks: null,
          status: Status.PENDING,
          final: 0,
          distance: null,
          destination: {
            disconnect: true
          }
        },
        include: {
          case: true
        }
      });
      if (updatedVerification.destinationId) {
        await tx.coordinates.delete({ where: { id: updatedVerification.destinationId } });
      }

      const updatedCase = await tx.commonData.update({
        where: { id: updatedVerification.case.id },
        data: {
          status: Status.PENDING,
          final: 0
        }
      });
      return updatedVerification;
    });

    sendNotification("New Verification", of_id, NotificationType.VERIFICATION, parseInt(id));

    apiResponse.success(res, { verification: transaction });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
