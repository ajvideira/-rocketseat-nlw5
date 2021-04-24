import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

export class UsersService {
  private usersRepository: UsersRepository;

  async create(email: string) {
    this.usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await this.usersRepository.findOne({ email });
    if (userAlreadyExists) {
      return userAlreadyExists;
    }

    const user = this.usersRepository.create({ email });

    await this.usersRepository.save(user);

    return user;
  }
}
