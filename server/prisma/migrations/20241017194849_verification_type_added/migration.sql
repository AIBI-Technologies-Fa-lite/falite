-- CreateTable
CREATE TABLE "VerificationType" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationType" ADD CONSTRAINT "VerificationType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
