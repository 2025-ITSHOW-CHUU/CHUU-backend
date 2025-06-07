import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || '3000'),
    GEMINI: {
        KEY: process.env.GEMINI_API_KEY ?? (() => { throw new Error('GEMINI_API_KEY is not set'); })(),
        PRO_MODEL: process.env.GEMINI_PRO_MODEL || 'gemini-2.0-flash',  //gemini-2.0-flash 버전이 가장 최근 버전, 너무 낮은 버전을 사용하면 한정량 에러가 나올 수 있으니 조심
        PRO_VISION_MODEL: process.env.GEMINI_PRO_VISION_MODEL || 'gemini-2.0-flash',
    },
};