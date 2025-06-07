import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { Provider } from "@nestjs/common";
import { env } from "src/configs/env.config";
import { GENERATION_CONFIG, SAFETY_SETTING } from "src/configs/gemini.config";
import { GEMINI_PRO_MODEL, GEMINI_PRO_VISION_MODEL } from "./gemini.constant";

export const GeminiProModelProvider: Provider<GenerativeModel> = {
    provide: GEMINI_PRO_MODEL,
    useFactory: () => {
        const genAI = new GoogleGenerativeAI(env.GEMINI.KEY);
        return genAI.getGenerativeModel({
            model: env.GEMINI.PRO_MODEL,
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTING,
        });
    },
};