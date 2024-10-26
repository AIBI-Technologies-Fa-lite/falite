import { Request, Response } from "express";
import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateVerification } from "../../dto";
import { bucket } from "../../config";
import prisma from "../../db";
import { Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const createVerification = async (req: Request, res: Response) => {
  const { verificationData, caseId } = req.body as { verificationData: CreateVerification; caseId: number };
  const files = req.files as Express.Multer.File[];
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

export const ofResponse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reject = false, remarks = null }: { reject?: boolean; remarks?: string | null } = req.body;
  try {
    if (reject) {
      await prisma.verification.update({ where: { id: parseInt(id) }, data: { status: Status.REASSIGN, feRemarks: remarks } });
      apiResponse.success(res, {});
    } else {
      await prisma.verification.update({ where: { id: parseInt(id) }, data: { status: Status.ONGOING } });
    }
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};
