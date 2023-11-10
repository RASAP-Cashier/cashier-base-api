import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOneByEmail(email: string) {
    const user = this.usersRepository.findOneBy({ email });
    return user;
  }

  findOneById = async (id: number) => {
    return this.usersRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new BadRequestException("Can't find user");
      })
      .then((user) => this.toPublicUser(user));
  };

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private toPublicUser(user: User): any {
    delete user.password;
    return user;
  }
}
