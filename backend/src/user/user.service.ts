import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(findOptions?: FindOptionsWhere<User>): Promise<User[]> {
    return this.userRepository.find({
      where: findOptions,
      order: { createdAt: 'DESC' },
    });
  }

  create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  update(id: string, user: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
