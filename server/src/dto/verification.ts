import { VerificationType, CommonData, Verification } from "@prisma/client";

// Type definition for creating a new Verification Type
export type CreateVerificationType = Pick<VerificationType, "name" | "formId">;

// Type definition for creating a new Case
export type CreateCase = Pick<CommonData, "applicantName" | "businessName" | "coApplicatntName" | "caseNumber" | "product" | "clientName">;

// Type definition for creating a new Verification
export type CreateVerification = Omit<
  Pick<Verification, "verificationTypeId" | "pincode" | "address" | "creRemarks" | "of_id">,
  "verificationTypeId" | "of_id"
> & {
  verificationTypeId: number; // Update to number
  of_id: number; // Update to number
};
