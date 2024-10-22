import { Request } from "express";

export enum statusCode {
  CREATED = 201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404
}
export interface CustomRequest extends Request {
  user?: any;
}

interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message: string;
  data?: T;
  errors?: string[] | { [key: string]: any };
  meta?: { [key: string]: any };
  timestamp?: string;
}

import { Response } from "express";

export class apiResponse {
  static success<T>(
    res: Response,
    data: T,
    meta: { [key: string]: any } = {},
    message: string = "Request successful",
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      status: "success",
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = "Something Went Wrong",
    errors: string[] | { [key: string]: any } = [],
    meta: { [key: string]: any } = {},
    statusCode: number = 500
  ): Response {
    const response: ApiResponse<null> = {
      status: "error",
      message,
      errors,
      meta,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static fail(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors: string[] | { [key: string]: any } = [],
    meta: { [key: string]: any } = {}
  ): Response {
    const response: ApiResponse<null> = {
      status: "fail",
      message,
      errors,
      meta,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }
}
