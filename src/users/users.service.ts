import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }

  async deleteUser(id: number): Promise<void> {
    const deleteResponse = await this.userRepository.softDelete(id)
    if (!deleteResponse.affected) {
      throw new NotFoundException(id);
    }
  }
}
