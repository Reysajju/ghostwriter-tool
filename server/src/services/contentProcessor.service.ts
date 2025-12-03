<<<<<<< HEAD
import mammoth from 'mammoth';
import fs from 'fs';
// pdf-parse doesn't have types by default, so we use require
const pdf = require('pdf-parse');

export const extractText = async (filePath: string, mimeType: string): Promise<string> => {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } else if (mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    } else {
        throw new Error('Unsupported file type: ' + mimeType);
    }
};
=======
import mammoth from 'mammoth';
import fs from 'fs';
// pdf-parse doesn't have types by default, so we use require
const pdf = require('pdf-parse');

export const extractText = async (filePath: string, mimeType: string): Promise<string> => {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } else if (mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    } else {
        throw new Error('Unsupported file type: ' + mimeType);
    }
};
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
