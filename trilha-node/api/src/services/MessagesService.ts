import { getCustomRepository } from 'typeorm';
import { MessagesRepository } from '../repositories/MessagesRepository';

type MessagServiceCreateParams = {
  user_id: string;
  admin_id?: string;
  text: string;
};

export class MessagesService {
  private messagesRepository: MessagesRepository;

  async create({ user_id, admin_id, text }: MessagServiceCreateParams) {
    this.messagesRepository = getCustomRepository(MessagesRepository);

    const message = this.messagesRepository.create({ user_id, admin_id, text });

    await this.messagesRepository.save(message);

    return message;
  }

  async showByUser(user_id: string) {
    this.messagesRepository = getCustomRepository(MessagesRepository);

    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ['user'],
    });

    return list;
  }
}
