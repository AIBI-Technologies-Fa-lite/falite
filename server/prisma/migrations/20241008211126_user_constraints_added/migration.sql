-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DIRECTOR', 'ADMIN', 'SUPERVISOR', 'CRE', 'OF');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ONGOING', 'REJECTED', 'REWORK', 'REASSIGN', 'REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "Coordinates" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formApiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "document" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "supervisorId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "startId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserBranches" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_locationId_key" ON "User"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserBranches_AB_unique" ON "_UserBranches"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBranches_B_index" ON "_UserBranches"("B");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_startId_fkey" FOREIGN KEY ("startId") REFERENCES "Coordinates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBranches" ADD CONSTRAINT "_UserBranches_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBranches" ADD CONSTRAINT "_UserBranches_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
