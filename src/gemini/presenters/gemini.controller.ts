import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GenerateTextDto } from 'src/gemini/dto/generate-text.dto';
import { GenAiResponse } from '../dto/gen-ai-response.dto';
import { GeminiService } from 'src/gemini/application/gemini.service';
import { teacherPrompts } from 'src/configs/teacher.data';

@Controller('chatbot')
export class GeminiController {
    @Get()
    getChatByTeacher(@Query('teacherId') teacherId: string) {
        if(!teacherId)
            throw new BadRequestException("teacherId가 필요합니다.");
        return {
            teacherId,
            massage: `${teacherId} 선생님과의 대화 목록입니다.`,
        }
    }

    constructor(private service: GeminiService) {}
    @Post('gemini')     // 서버에서 새로운 응답 생성
    async generateText(@Body() dto: GenerateTextDto): Promise<GenAiResponse & { teacherId: string }> {
        if (!dto || !dto.teacherId) {
            throw new BadRequestException('teacherId가 필요합니다.');
        }
        
        if (!teacherPrompts[dto.teacherId]) {
            throw new BadRequestException(`유효하지 않은 teacherId: ${dto.teacherId}. 가능한 값은 teacher1, teacher2, teacher3, teacher4, teacher5, teacher6입니다.`);
        }
        
        if (!dto.prompt) {
            throw new BadRequestException('prompt가 필요합니다.');
        }

        const result = await this.service.generateText(dto.teacherId, dto.prompt);
        
        return  {
            ...result,
            teacherId: dto.teacherId,
        };
    }
}
