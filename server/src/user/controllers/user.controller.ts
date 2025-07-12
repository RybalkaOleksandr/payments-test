import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser } from '../types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Get('count')
  async count(): Promise<{ count: number }> {
    const count = await this.userService.count();
    return { count };
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<IUser[]> {
    if (!query) {
      return this.userService.findAll();
    }
    return this.userService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('reload')
  async reload(): Promise<{ message: string }> {
    await this.userService.reloadFromFile();
    return { message: 'Users data reloaded successfully' };
  }
}
