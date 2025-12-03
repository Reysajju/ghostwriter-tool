"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
const mammoth_1 = __importDefault(require("mammoth"));
const fs_1 = __importDefault(require("fs"));
// pdf-parse doesn't have types by default, so we use require
const pdf = require('pdf-parse');
const extractText = async (filePath, mimeType) => {
    const buffer = fs_1.default.readFileSync(filePath);
    if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    }
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth_1.default.extractRawText({ buffer });
        return result.value;
    }
    else if (mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    }
    else {
        throw new Error('Unsupported file type: ' + mimeType);
    }
};
exports.extractText = extractText;
