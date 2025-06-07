import { Test, TestingModule } from '@nestjs/testing';
import { GeminiController } from './gemini.controller';
import { GeminiService } from '../application/gemini.service';

describe('GeminiController', () => {
  let controller: GeminiController;
  let service: GeminiService; // 실제 호출될 Service

  const mockGeminiService = {
    generateText: jest.fn().mockResolvedValue({
      totalTokens: 10,
      text: 'mocked response',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiController],
      providers: [
        {
          provide: GeminiService,
          useValue: mockGeminiService,
        },
      ],
    }).compile();

    controller = module.get<GeminiController>(GeminiController);
    service = module.get<GeminiService>(GeminiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateText', () => {
    it('should return response from service', async () => {
      const teacherId = 'teacher123';
      const prompt = '안녕?';

      const result = await controller.generateText({ teacherId, prompt });

      expect(result).toEqual({
        totalTokens: 10,
        text: 'mocked response',
      });

      expect(service.generateText).toHaveBeenCalledWith(teacherId, prompt);
    });
  });
});
