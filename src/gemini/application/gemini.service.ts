import { Inject, Injectable } from '@nestjs/common';
import { GEMINI_PRO_MODEL } from '../gemini.constant';
import { GenerativeModel } from '@google/generative-ai';
import { createContent } from 'content.helper';
import { GenAiResponse } from '../dto/gen-ai-response.dto';
import { teacherPrompts } from 'src/configs/teacher.data';

@Injectable()
export class GeminiService {
  constructor(
    @Inject(GEMINI_PRO_MODEL) private readonly proModel: GenerativeModel,
  ) {}

  async generateText(
    teacherId: string,
    message: string,
    roomId?: string,
    userName?: string,
  ): Promise<GenAiResponse> {
    const teacher = teacherPrompts[teacherId];

    if (!teacher) {
      throw new Error('유효하지 않은 teacherId입니다.');
    }

    const prompt = `너는 ${teacher.name}이야, 너를 학생들이 ${teacher.name}으로 부를거야
        너는 ${teacher.personality}이라는 성격을 가지고 있어.
        너의 전문 분야는 ${teacher.specialties.join(', ')}야.
        마지막으로 너는 처음 학생들에 대한 답변으로 ${teacher.prompt}를 기반으로 대답하고 
        전공이나 학교 관련된 질문을 하면 ${teacher.name}처럼 답변을 해줘야 돼 질문에 벗어나는 답변을 하면 안돼
        ${teacher}야~ 라고 소개는 한번만 해줘 `;

    const text = await this.callGeminiAPI(prompt, message);

    return {
      text,
      totalTokens: text.length,
    };
  }

  private sanitizeText(raw: any): string {
    const text = typeof raw === 'object' ? JSON.stringify(raw) : String(raw);

    // 마크다운 제거
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
      .replace(/__(.*?)__/g, '$1') // __bold__
      .replace(/\*(.*?)\*/g, '$1') // *italic*
      .replace(/_(.*?)_/g, '$1') // _italic_
      .replace(/`(.*?)`/g, '$1'); // `code`
  }

  public async callGeminiAPI(
    context: string,
    message: string,
  ): Promise<string> {
    const contents = createContent([
      { role: 'assistant', content: context },
      { role: 'user', content: message },
    ]);

    try {
      const result = await this.proModel.generateContent({ contents });
      const response = await result.response;
      const parts = response.candidates?.[0]?.content?.parts;

      const text = Array.isArray(parts)
        ? parts.map((part: any) => part.text || '').join('\n')
        : '응답에서 텍스트를 추출하지 못했어요.';

      const cleanedText = this.sanitizeText(text);

      return cleanedText;
    } catch (error) {
      console.error('Gemini API 호출 중 오류 발생:', error);
      throw new Error('Gemini API 호출에 실패했습니다.');
    }
  }
}
