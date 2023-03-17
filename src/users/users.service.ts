import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constants/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly UserRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.UserRepository.create<User>(createUserDto);
  }

  findAll() {
    return this.UserRepository.findAll<User>();
  }

  async findOneByEmail(email: string) {
    return await this.UserRepository.findOne<User>({ where: { email } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    return await this.UserRepository.update(
      { ...updateUserDto },
      { where: { email }, returning: true },
    );
  }

  async remove(email: string) {
    return await this.UserRepository.destroy<User>({ where: { email } });
  }
}
