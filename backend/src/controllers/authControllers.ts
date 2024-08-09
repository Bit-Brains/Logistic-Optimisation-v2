import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { generateOTP } from "../helper/utility";
dotenv.config();

const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY || "secretKey";
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (req: Request, res: Response) => {
  const { phone, countryCode } = req.body;

  const otp = generateOTP();
  const expirationTime = new Date(new Date().getTime() + 10 * 60000); // OTP expires in 10 minutes.

  try {
    await prisma.oTP.create({
      data: {
        phone: phone,
        otp: otp,
        expirationTime: expirationTime
      }
    });

    const toNumber = `${countryCode}${phone}`

    await twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber
    });

    res.status(200).json({
      message: "OTP sent successfully"
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}


export const CustomerSignup = async (req: Request, res: Response) => {
  const { firstname, lastname, password, email, userType, additionalInfo, phone } = req.body;
  try {
    // Checking if user Already Exists :-
    const existingUser = await prisma.user.findUnique({
      where: {
        Email: email,
      }
    })
    if (existingUser) {
      return res.status(400).json({
        error: "User Already Exists"
      });
    }

    // Hash The Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        Firstname: firstname,
        Lastname: lastname,
        Password: hashedPassword,
        Email: email,
        UserType: userType,
        Phone: phone
      }
    });

    // Create the related entity based on the userType
    switch (userType) {
      case 'CUSTOMER':
        await prisma.customer.create({
          data: {
            UserID: newUser.UserID,
          }
        });
        break;
      case 'SUPPLIER':
        await prisma.supplier.create({
          data: {
            UserID: newUser.UserID,
            CompanyName: additionalInfo.companyName
          }
        });
        break;
      case 'TRANSPORTER':
        await prisma.transporter.create({
          data: {
            UserID: newUser.UserID,
            CompanyName: additionalInfo.companyName,
            ChargePerKm: additionalInfo.chargePerKm
          }
        })
        break;
      default:
        return res.status(400).json({
          error: "Invalid User Type"
        });
    }

    // Generate a JWT Token
    const token = jwt.sign({ userId: newUser.UserID }, secretKey);
    console.log("Hello");

    return res.status(200).json({
      user: newUser,
      token: token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}

export const login = async (req: Request, res: Response) => {
  res.send("Hello World");
}
