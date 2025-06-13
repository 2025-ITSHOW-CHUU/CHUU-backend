import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './schemas/teacher.schema';

@Controller('teachers')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Get()
    findAll(): Promise<Teacher[]> {
        return this.teacherService.findAll();
    }

    @Post()
    create(@Body() data: Partial<Teacher>): Promise<Teacher> {
        return this.teacherService.create(data);
    }
}