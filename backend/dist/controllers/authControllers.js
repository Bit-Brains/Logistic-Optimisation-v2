"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.CustomerSignup = exports.sendOTP = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const twilio_1 = __importDefault(require("twilio"));
const utility_1 = require("../helper/utility");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const secretKey = process.env.SECRET_KEY || "secretKey";
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, countryCode } = req.body;
    const otp = (0, utility_1.generateOTP)();
    const expirationTime = new Date(new Date().getTime() + 10 * 60000); // OTP expires in 10 minutes.
    try {
        yield prisma.oTP.create({
            data: {
                phone: phone,
                otp: otp,
                expirationTime: expirationTime
            }
        });
        const toNumber = `${countryCode}${phone}`;
        yield twilioClient.messages.create({
            body: `Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: toNumber
        });
        res.status(200).json({
            message: "OTP sent successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.sendOTP = sendOTP;
const CustomerSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, password, email, userType, additionalInfo, phone } = req.body;
    try {
        // Checking if user Already Exists :-
        const existingUser = yield prisma.user.findUnique({
            where: {
                Email: email,
            }
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User Already Exists"
            });
        }
        // Hash The Password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the user
        const newUser = yield prisma.user.create({
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
                yield prisma.customer.create({
                    data: {
                        UserID: newUser.UserID,
                    }
                });
                break;
            case 'SUPPLIER':
                yield prisma.supplier.create({
                    data: {
                        UserID: newUser.UserID,
                        CompanyName: additionalInfo.companyName
                    }
                });
                break;
            case 'TRANSPORTER':
                yield prisma.transporter.create({
                    data: {
                        UserID: newUser.UserID,
                        CompanyName: additionalInfo.companyName,
                        ChargePerKm: additionalInfo.chargePerKm
                    }
                });
                break;
            default:
                return res.status(400).json({
                    error: "Invalid User Type"
                });
        }
        // Generate a JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: newUser.UserID }, secretKey);
        console.log("Hello");
        return res.status(200).json({
            user: newUser,
            token: token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
exports.CustomerSignup = CustomerSignup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hello World");
});
exports.login = login;
