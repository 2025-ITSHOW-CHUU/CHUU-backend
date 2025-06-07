export class CreateMessageDto {
    roomId: string;
    teacherId: string;
    message: string;
    read?: boolean;
}