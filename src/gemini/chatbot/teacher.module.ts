import { Module } from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Teacher, TeacherSchema } from "./schemas/teacher.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Teacher.name, schema: TeacherSchema}
        ])
    ],
    providers: [TeacherService],
    exports: [TeacherService, MongooseModule],
})
export class TeacherModule {}