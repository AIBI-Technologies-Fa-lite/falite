import { VerificationType } from "@prisma/client";

export type CreateVerificationType = Pick<VerificationType, "name" | "formId">;
