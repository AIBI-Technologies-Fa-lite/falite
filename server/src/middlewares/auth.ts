import { Request, NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../db";
import { apiResponse, CustomRequest, statusCode } from "../utils/response";
import { Role } from "@prisma/client";

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check Authorization header for Bearer token
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.token) {
    // Check token cookie
    token = req.cookies.token;
  }

  // If no token is found, deny access
  if (!token) {
    return apiResponse.fail(res, "Access Denied", statusCode.UNAUTHORIZED);
  }

  try {
    const secretKey: string = process.env.JWT_SECRET || "";
    const verified: any = verify(token, secretKey);

    // Fetch the user based on the decoded token information (assuming the token contains the user ID)
    const user = await prisma.user.findUnique({
      where: {
        id: verified.userId // Adjust this based on your token payload structure
      },
      select: {
        id: true,
        organizationId: true,
        firstName: true,
        role: true,
        branches: true
      }
    });

    if (!user) {
      apiResponse.fail(res, "Use Not Found", statusCode.NOT_FOUND);
    }

    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    apiResponse.fail(res, "Invalid Token", statusCode.UNAUTHORIZED);
  }
};

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming the user's role is available in req.user.role
    const userRole = (req as CustomRequest).user.role;
    // Check if the user's role is in the list of allowed roles
    if (allowedRoles.includes(userRole)) {
      next(); // Role is allowed, continue to the next middleware/route handler
    } else {
      apiResponse.fail(res, "Access denied.", statusCode.FORBIDDEN);
    }
  };
}
