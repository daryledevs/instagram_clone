"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceToken = exports.generateResetToken = exports.generateRefreshToken = exports.generateAccessToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const nanoid_1 = require("nanoid");
dotenv.config();
const REFRESH_TOKEN_EXPIRATION = "7d";
const ACCESS_TOKEN_EXPIRATION = "15m";
const RESET_TOKEN_EXPIRATION = "1hr";
function verifyToken(token, secret, tokenName) {
    return new Promise((resolve, reject) => {
        const errorField = `${tokenName}Error`;
        const decodeField = `${tokenName}Decode`;
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, secret);
            resolve({ [errorField]: null, [decodeField]: decodedToken });
        }
        catch (error) {
            const decodedToken = jsonwebtoken_1.default.decode(token);
            return resolve({ [errorField]: error?.name, [decodeField]: decodedToken });
        }
    });
}
exports.verifyToken = verifyToken;
function generateRefreshToken({ user_id, username }) {
    const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET;
    const details = { user_id: user_id, username: username };
    const expiration = { expiresIn: REFRESH_TOKEN_EXPIRATION };
    const token = jsonwebtoken_1.default.sign(details, REFRESH_SECRET, expiration);
    return token;
}
exports.generateRefreshToken = generateRefreshToken;
;
function generateAccessToken({ user_id, roles }) {
    const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET;
    const details = { user_id: user_id, roles: roles };
    const expiration = { expiresIn: ACCESS_TOKEN_EXPIRATION };
    const token = jsonwebtoken_1.default.sign(details, ACCESS_SECRET, expiration);
    return token;
}
exports.generateAccessToken = generateAccessToken;
;
function generateResetToken({ EMAIL, user_id }) {
    const RESET_SECRET = process.env.RESET_PWD_TKN_SECRET;
    const details = { email: EMAIL, user_id: user_id };
    const expiration = { expiresIn: RESET_TOKEN_EXPIRATION };
    const token = jsonwebtoken_1.default.sign(details, RESET_SECRET, expiration);
    return token;
}
exports.generateResetToken = generateResetToken;
;
async function referenceToken() {
    const shortToken = (0, nanoid_1.nanoid)(10);
    return shortToken;
}
exports.referenceToken = referenceToken;
;
