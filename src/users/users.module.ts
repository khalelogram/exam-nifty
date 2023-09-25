import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    SharedModule
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService],
})
export class UsersModule {}
