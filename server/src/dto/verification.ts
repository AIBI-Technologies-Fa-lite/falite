import { VerificationType, CommonData, Verification } from "@prisma/client";

export type CreateVerificationType = Pick<VerificationType, "name" | "formId">;
export type CreateCase = Pick<CommonData, "applicantName" | "businessName" | "coApplicatntName" | "caseNumber" | "product" | "clientName">;
export type CreateVerification = Pick<Verification, "verificationTypeId" | "pincode" | "address" | "creRemarks" | "of_id">;
