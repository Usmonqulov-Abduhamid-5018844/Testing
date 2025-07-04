import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  async findAll() {
    const users = await this.repo.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.repo.update({ id }, updateUserDto);
    const user = await this.repo.findOne({ where: { id } });
    return user;
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return {};
  }
}
