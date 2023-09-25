import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'Created User.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.save(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'Fetch all users.' })
  async findAll(@Res() res:Response) {
    const users = await this.usersService.find({
      where: {
        deletedAt: null
      }
    });

    if (users.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "No users yet",
        error: true
      });
    } else {
      return res.status(HttpStatus.OK).json(users);
    }
  } 

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 201, description: 'Get user.' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne({
      where: {
        id: id,
        deletedAt: null
      }
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 201, description: 'Updated user.' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    var date = new Date();

    return this.usersService.update(id, {
      ...updateUserDto,
      date_updated: date
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 201, description: 'Deleted user.' })
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
