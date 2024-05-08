"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64 = exports.sortObjectKeys = exports.pemToHex = void 0;
const base64url_1 = __importDefault(require("base64url"));
function pemToHex(pem) {
    const base64String = pem
        .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
        .replace(/\s+/g, '');
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('hex');
}
exports.pemToHex = pemToHex;
function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }
    else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
            result[key] = sortObjectKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}
exports.sortObjectKeys = sortObjectKeys;
function encodeBase64(data) {
    return base64url_1.default.encode(data);
}
exports.encodeBase64 = encodeBase64;
