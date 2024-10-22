import { User } from "@prisma/client";

export type CreateUser = Pick<User, "firstName" | "lastName" | "email" | "password">;

export type CreateEmployee = Pick<
  User,
  "firstName" | "lastName" | "email" | "password" | "bloodGroup" | "address" | "supervisorId" | "role" | "phone" | "dob"
>;

export type Login = Pick<User, "email" | "password">;
