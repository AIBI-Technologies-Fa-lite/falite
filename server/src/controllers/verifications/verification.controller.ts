import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateVerification } from "../../dto";
import { bucket } from "../../config";
import prisma from "../../db";
import { NotificationType, Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { sendNotification } from "../../utils/notification";
export const createVerification = async (req: Request, res: Response) => {
  const { verificationData, caseId } = req.body as { verificationData: any; caseId: string };
  const files = req.files as Express.Multer.File[];
  console.log(verificationData);
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
          id: true
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
      await sendNotification("New Verification Assigned", verificationData.of_id, NotificationType.VERIFICATION, verification.id);
      return verification;
    });

    apiResponse.success(res, { verification: transaction });
  } catch (err) {
    console.error("Transaction failed: ", err);
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
        data: { status: Status.REASSIGN, feRemarks: remarks },
        include: { case: { select: { employeeId: true } } }
      });

      await sendNotification("Verification Rejected", foundVerification.case.employeeId, NotificationType.VERIFICATION, foundVerification.id);
      apiResponse.success(res, {});
    } else {
      await prisma.verification.update({ where: { id: parseInt(id) }, data: { status: Status.ONGOING } });
    }
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
