import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';

export class SettingsController {
  async create(request: Request, response: Response) {
    const { username, chat } = request.body;

    const settingsService = new SettingsService();

    const settings = await settingsService.save({ chat, username });
    return response.json(settings);
  }

  async findByUsername(request: Request, response: Response) {
    const { username } = request.params;

    const settingsService = new SettingsService();

    const settings = await settingsService.findByUsername(username);
    return response.json(settings);
  }

  async update(request: Request, response: Response) {
    const { username } = request.params;
    const { chat } = request.body;

    const settingsService = new SettingsService();

    const settings = await settingsService.save({ chat, username });
    return response.json(settings);
  }
}
