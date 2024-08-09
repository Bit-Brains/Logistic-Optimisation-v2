"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.formatNumber = void 0;
const formatNumber = (phone, countryCode) => {
    return `${countryCode}${phone}`;
};
exports.formatNumber = formatNumber;
const generateOTP = () => {
    return Math.floor(Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
