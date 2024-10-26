import { Request, Response } from "express";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import { apiResponse } from "../../utils/response";
import prisma from "../../db";

import { Login } from "../../dto";
import { CreateCoordinates } from "../../dto/location";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { credentials, location }: { credentials: Login; location: CreateCoordinates } = req.body;

  try {
    if (!location.latitude || !location.longitude) {
      apiResponse.fail(res, "Turn on your location services");
    } else {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        select: { id: true, password: true, location: true, firstName: true, role: true, locationId: true, working: true }
      });

      if (!user) {
        apiResponse.fail(res, "Invalid credentials");
        return;
      }

      // Compare the provided password with the stored hashed password
      const match = await compare(credentials.password, user.password);
      if (!match) {
        apiResponse.fail(res, "Invalid credentials");
        return;
      }

      // Update user's location
      await prisma.coordinates.update({
        data: { latitude: location.latitude, longitude: location.longitude },
        where: { id: user.locationId }
      });

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, config.JWT_SECRET as string, { expiresIn: "1h" });

      // Set the token in the response cookie
      res.cookie("token", token, { httpOnly: true, secure: config.ENV === "production" });

      apiResponse.success(res, { token, user: { id: user.id, firstName: user.firstName, role: user.role, working: user.working } });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    apiResponse.error(res);
  }
};
