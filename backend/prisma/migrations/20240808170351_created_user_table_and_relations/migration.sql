-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'TRANSPORTER');

-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "Firstname" TEXT NOT NULL,
    "Lastname" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "UserType" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Customer" (
    "CustomerID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("CustomerID")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "SupplierId" SERIAL NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("SupplierId")
);

-- CreateTable
CREATE TABLE "Transporter" (
    "TransporterId" SERIAL NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "ChargePerKm" DOUBLE PRECISION NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Transporter_pkey" PRIMARY KEY ("TransporterId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_UserID_key" ON "Customer"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_UserID_key" ON "Supplier"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Transporter_UserID_key" ON "Transporter"("UserID");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transporter" ADD CONSTRAINT "Transporter_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
