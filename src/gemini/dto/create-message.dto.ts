import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    roomId: string;

    @IsNotEmpty()
    @IsString()
    teacherId: string;

    @IsOptional() // role이 'user'일 때만 필수
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsIn(['user', 'assistant'])
    role: 'user' | 'assistant';
}