import { Inject, Injectable } from '@nestjs/common';
import { GEMINI_PRO_MODEL, GEMINI_PRO_VISION_MODEL } from '../gemini.constant';
import { GenerativeModel } from '@google/generative-ai';
import { createContent } from 'content.helper';
import { GenAiResponse } from '../dto/gen-ai-response.dto';
import { teacherPrompts } from 'src/configs/teacher.data';

@Injectable()
export class GeminiService {
    constructor(
        @Inject(GEMINI_PRO_MODEL) private readonly proModel: GenerativeModel,
    ) {}

    // text 생성 메서드
    async generateText(teacherId: string, userMessage: string): Promise<GenAiResponse> {
        const teacherPrompt = teacherPrompts[teacherId]?.prompt;
        const prompt = `${teacherPrompt} 학생: ${userMessage} 선생님:`;
        // 토큰 카운팅 없이 바로 api 호출
        const text = await this.callGeminiAPI(prompt);
        // 토큰 수 계산 불가, 문자열 길이 기반 추정값 사용
        const estimatedTokens = Math.ceil(prompt.length / 4);
        return { totalTokens: estimatedTokens, text };
    }

    private async callGeminiAPI(prompt: string): Promise<string>{
        const contents = createContent(prompt);
        try {
            const result = await this.proModel.generateContent({ contents });
            const response = await result.response;
            const text = await response.text();
            return text;
        } catch (error) {
            console.error('Gemini API 호출 중 오류 발생:', error);
            throw new Error('Gemini API 호출에 실패했습니다.');
        }
    }
}
