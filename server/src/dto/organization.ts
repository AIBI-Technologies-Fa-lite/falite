import { Organization, Branch } from "@prisma/client";

export type CreateOrganization = Pick<Organization, "name">;
export type CreateBranch = Pick<Branch, "name" | "code">;
