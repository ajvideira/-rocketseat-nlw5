import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';

export class SettingsController {
  async create(request: Request, response: Response) {
    const { username, chat } = request.body;

    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });
      return response.json(settings);
    } catch (e) {
      return response.status(400).json({ message: e.message });
    }
  }
}
