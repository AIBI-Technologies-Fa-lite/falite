import { Role } from "@prisma/client";
import { hash, genSalt } from "bcrypt";
import { Request, Response } from "express";
import { apiResponse, statusCode } from "../../utils/response";
import { CreateUser, CreateOrganization } from "../../dto";
import prisma from "../../db";

export const createOrgAdmin = async (req: Request, res: Response) => {
  const user: CreateUser = req.body.user;
  const organization: CreateOrganization = req.body.organization;

  try {
    await prisma.$transaction(async (prisma) => {
      const newOrganization = await prisma.organization.create({
        data: {
          ...organization
        }
      });

      const salt = await genSalt(10);
      const newPassword = await hash(user.password, salt);

      const location = await prisma.coordinates.create({
        data: {
          latitude: 0,
          longitude: 0
        }
      });

      await prisma.user.create({
        data: {
          role: Role.ADMIN,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: newPassword,
          organization: {
            connect: newOrganization
          },
          location: {
            connect: location
          }
        },
        select: {
          id: true
        }
      });
    });
    apiResponse.success(res, "User Created Successfully");
  } catch (err) {
    apiResponse.error(res);
  }
};
