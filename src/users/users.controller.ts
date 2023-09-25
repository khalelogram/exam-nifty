import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, ClassSerializerInterceptor, BadRequestException, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import * as bcryptjs from 'bcryptjs';
import { MoreThanOrEqual, Not } from 'typeorm';
import { AuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post()
  @ApiOperation({ summary: 'Create admin user' })
  @ApiResponse({ status: 201, description: 'Created Admin User.' })
  async createAdmin(@Body() body: CreateUserDto, @Res() res:Response) {

    const { password, email } = body;
    
    try {

      const existingUser = await this.usersService.find({
        where: {
          email: email
        }
      })

      if (existingUser.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Email already taken",
          error: true
        });
      }

      const user = await this.usersService.save({
        ...body,
        email,
        password: await bcryptjs.hash(password, 12),
        roles: 'admin'
      });

      if(user) {
        res.status(HttpStatus.OK).json({
          message: "Admin user created successfully",
          error: false
        })
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Something went wrong",
          error: true
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  @Post('/members')
  @ApiOperation({ summary: 'Create member user' }) 
  @ApiResponse({ status: 201, description: 'Created Member User.' })
  async createMember(@Body() body: CreateUserDto, @Res() res:Response) {

    const { password, email } = body;
    
    try {

      const existingUser = await this.usersService.find({
        where: {
          email: email
        }
      })

      if (existingUser.length > 0) {
        throw new BadRequestException("Email already exists");
      }

      const user = await this.usersService.save({
        ...body,
        email,
        password: await bcryptjs.hash(password, 12),
        roles: 'members'
      });

      if(user) {
        res.status(HttpStatus.OK).json({
          message: "User created successfully",
          error: false
        })
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Something went wrong",
          error: true
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' }) 
  @ApiResponse({ status: 201, description: 'Login User.' })
    async login(
        @Body() body: LoginDto,
        @Res({passthrough: true}) response:Response
    ) {
        const user = await this.usersService.findOne({
            where: {
                email: body.email
            }
        });


        if(!user){
            throw new BadRequestException("User does not exist");
        }
        const passwordMatch = await bcryptjs.compare(body.password, user.password);
        
        if(!passwordMatch) {
            throw new BadRequestException('Invalid credentials');   
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id,
            roles: user.roles,
        }, {expiresIn: "1d"});

        const refreshToken = await this.jwtService.signAsync({
            id: user.id,
            roles: user.roles,
        });

        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 7);

        await this.tokenService.save({
            user_id: user.id,
            token: refreshToken,
            expires_at
        })

        response.status(200);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        });

        return {
            token: accessToken
        }
    }


    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('current')
    async user(
        @Req() request: Request
    ) {
        try {   
            const accessToken = request.headers.authorization.replace('Bearer ', '');
            
            const payload = await this.jwtService.verifyAsync(accessToken);

            return this.usersService.findOne({
                where: {
                    id: payload.id
                },
            })
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException();
        }
        
    }

    @UseGuards(AuthGuard)
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh' }) 
    @ApiResponse({ status: 201, description: 'Refresh JWT Token.' })
    async refresh(
        @Req() request:Request,
        @Res({passthrough: true}) response:Response
    ) {
        try {
            const payload = await this.jwtService.verifyAsync(request.cookies['refresh_token']);

            const tokenEntity = await this.tokenService.findOne({
                where: {
                    user_id: payload.id,
                    expires_at: MoreThanOrEqual(new Date())
                }
            });
            
            if(!tokenEntity) {
                throw new UnauthorizedException();
            }

            const accessToken = await this.jwtService.signAsync({
                id: payload.id,
                email: payload.email,
                roles: payload.roles,
            }, {expiresIn: "1d"});

            response.status(200);

            return {
                token: accessToken
            };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
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
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "No users yet",
        error: true
      });
    } else {
      res.status(HttpStatus.OK).json(users);
    }
  } 

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get('members')
  @ApiOperation({ summary: 'Fetch all members' })
  @ApiResponse({ status: 200, description: 'Fetch all members.' })
  async findAllMembers(@Res() res:Response) {
    const users = await this.usersService.find({
      where: {
        roles: Not('admin')
      }
    });

    if (users.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "No members yet",
        error: true
      });
    } else {
      res.status(HttpStatus.OK).json(users);
    }
  } 

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 201, description: 'Deleted user.' })
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
