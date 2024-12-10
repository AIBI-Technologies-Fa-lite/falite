import { User } from "@prisma/client";

export type CreateUser = Pick<
  User,
  "firstName" | "lastName" | "email" | "password"
>;

export type CreateEmployee = Pick<
  User,
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "bloodGroup"
  | "address"
  | "role"
  | "phone"
  | "dob"
  | "aadhar"
  | "pan"
>;

export type Login = Pick<User, "email" | "password">;
