import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { TeacherSeeder } from 'src/seeds/teacher.seeder';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Teacher.name, schema: TeacherSchema}
        ])
    ],
    providers: [TeacherService, TeacherSeeder],
    exports: [TeacherService, MongooseModule, TeacherSeeder],
})
export class TeacherModule {}