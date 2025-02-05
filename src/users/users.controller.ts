import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './schemas/users.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('type/:type')
  async findMatchType(@Param('type') type: string) {
    return this.userService.findMatchType(type);
  }

  @Post('test/save')
  async createUser(@Body() userData: { score: number; type: string }) {
    return this.userService.createUser(userData);
  }
}
