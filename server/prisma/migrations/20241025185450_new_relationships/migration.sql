-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "verificationTypeId" INTEGER NOT NULL,
    "pincodeId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "caseId" INTEGER NOT NULL,
    "creRemarks" TEXT,
    "feRemarks" TEXT,
    "distance" DOUBLE PRECISION,
    "destinationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonData" (
    "id" SERIAL NOT NULL,
    "applicantName" TEXT NOT NULL,
    "businessName" TEXT,
    "coApplicatntName" TEXT,
    "caseNumber" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "CommonData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "verificationId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pincode" (
    "id" SERIAL NOT NULL,
    "zip" INTEGER NOT NULL,

    CONSTRAINT "Pincode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PincodeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pincode_zip_key" ON "Pincode"("zip");

-- CreateIndex
CREATE UNIQUE INDEX "_PincodeToUser_AB_unique" ON "_PincodeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PincodeToUser_B_index" ON "_PincodeToUser"("B");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationTypeId_fkey" FOREIGN KEY ("verificationTypeId") REFERENCES "VerificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_pincodeId_fkey" FOREIGN KEY ("pincodeId") REFERENCES "Pincode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CommonData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Coordinates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonData" ADD CONSTRAINT "CommonData_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PincodeToUser" ADD CONSTRAINT "_PincodeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pincode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PincodeToUser" ADD CONSTRAINT "_PincodeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
