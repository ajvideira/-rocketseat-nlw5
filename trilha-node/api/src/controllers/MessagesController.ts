import { Request, Response } from 'express';
import { MessagesService } from '../services/MessagesService';

export class MessagesController {
  async create(request: Request, response: Response) {
    const { user_id, admin_id, text } = request.body;

    const messagesService = new MessagesService();

    const message = await messagesService.create({ user_id, admin_id, text });

    return response.json(message);
  }

  async showByUser(request: Request, response: Response) {
    const { user_id } = request.params;

    const messagesService = new MessagesService();

    const messageList = await messagesService.showByUser(user_id);

    return response.json(messageList);
  }
}
