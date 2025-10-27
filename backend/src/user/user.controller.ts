import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() body: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
