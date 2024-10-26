import { apiResponse, CustomRequest } from "../../utils/response";
import { CreateEmployee } from "../../dto";
import { genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import { bucket } from "../../config";
import prisma from "../../db";
import { Role } from "@prisma/client";
import { getFile } from "../../utils/image";
import { v4 as uuidv4 } from "uuid";
export const createEmployee = async (req: Request, res: Response) => {
  const { data, branchId } = req.body as { data: CreateEmployee; branchId: number[] };
  const user = (req as CustomRequest).user;

  try {
    // Handle file upload from Multer
    let documentUrl: string | null = null;
    if (req.file) {
      // Generate a unique filename using UUID
      const uniqueFilename = `${uuidv4()}_${req.file.originalname}`;
      const blob = bucket.file(`documents/${uniqueFilename}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype
      });

      await new Promise<void>((resolve, reject) => {
        blobStream.on("error", (err) => {
          console.error("Error uploading document:", err);
          apiResponse.error(res, "Failed to upload document");
          reject(err);
        });

        blobStream.on("finish", () => {
          documentUrl = `${blob.name}`;
          resolve();
        });

        blobStream.end(req.file?.buffer);
      });
    }

    // Create a location with default latitude and longitude
    const location = await prisma.coordinates.create({
      data: {
        latitude: 0,
        longitude: 0
      }
    });

    // Hash the user's password
    const salt = await genSalt(10);
    const newPassword = await hash(data.password, salt);

    // Connect branches to user (many-to-many relationship)
    const branchConnections = branchId.map((id) => ({ id: Number(id) }));

    // Create the user with Prisma
    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        bloodGroup: data.bloodGroup,
        phone: data.phone,
        dob: data.dob,
        email: data.email,
        password: newPassword,
        role: data.role,
        address: data.address,
        document: documentUrl, // Save the uploaded document URL
        location: {
          connect: { id: location.id }
        },
        organization: {
          connect: { id: user.organizationId }
        },
        branches: {
          connect: branchConnections
        }
      }
    });

    // Send success response
    apiResponse.success(res, "User Created Successfully");
  } catch (err) {
    console.error("Error creating user:", err); // Log error for debugging
    apiResponse.error(res, "Failed to create user");
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    order = "desc",
    role = ""
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    order?: "asc" | "desc";
    role?: string;
  };
  const user = (req as CustomRequest).user;
  let whereClause: any = {
    organizationId: user.organizationId,
    deleted: false,
    firstName: {
      contains: search,
      mode: "insensitive"
    }
  };
  if (role != "") {
    whereClause = { ...whereClause, role };
  }
  try {
    const skipAmount = (parseInt(page) - 1) * parseInt(limit);

    const [employees, totalEmployees] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        orderBy: {
          createdAt: order
        },
        skip: skipAmount,
        take: parseInt(limit),
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          role: true
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);
    if (!employees || employees.length === 0) {
      apiResponse.success(res, "Not Found");
      return;
    }

    const pages = Math.ceil(totalEmployees / parseInt(limit));
    apiResponse.success(res, { employees }, { pages });
  } catch (err) {
    console.log(err);
    apiResponse.error(res);
  }
};

export const getEmployeesById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const userId: number = parseInt(id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        bloodGroup: true,
        document: true,
        createdAt: true,
        reportees: true,
        supervisor: true,
        address: true,
        phone: true,
        dob: true,
        branches: {
          select: {
            name: true
          }
        }
      }
    });
    if (!user) {
      apiResponse.success(res, "User Not Found");
      return;
    }
    let documentUrl: string | null = null;
    if (user.document) documentUrl = await getFile(user.document);
    user.document = documentUrl;
    apiResponse.success(res, { user });
  } catch (err) {
    apiResponse.error(res);
  }
};

export const getEmployeeByRole = async (req: Request, res: Response) => {
  const { role } = req.params as { role: Role };

  try {
    // Fetch employees based on role with their branch and organization data
    const employees = await prisma.user.findMany({
      where: { role: role },
      include: {
        branches: true, // Include branch details if needed
        organization: true, // Include organization details if needed
        location: true // Include location if relevant
      }
    });

    // Check if employees with the role exist
    if (employees.length === 0) {
      return apiResponse.fail(res, "No employees found with this role");
    }

    // Send success response with found employees
    apiResponse.success(res, "Employees retrieved successfully", employees);
  } catch (err) {
    console.error("Error retrieving employees by role:", err); // Log error for debugging
    apiResponse.error(res, "Failed to retrieve employees");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        deleted: true
      }
    });
    apiResponse.success(res, {});
  } catch (err) {
    apiResponse.error(res);
  }
};

export const updatePassword = async (req: Request, res: Response) => {};
