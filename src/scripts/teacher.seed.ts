import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { TeacherSeeder } from 'src/seeds/teacher.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(TeacherSeeder);
  await seeder.onModuleInit(); // 여기서 seed 수행
  await app.close();
}

bootstrap();
