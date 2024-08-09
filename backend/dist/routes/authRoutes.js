"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const router = express_1.default.Router();
router.post("/login", authControllers_1.login);
router.get("/otp", authControllers_1.sendOTP);
router.post("/custSignup", authControllers_1.CustomerSignup);
exports.default = router;
