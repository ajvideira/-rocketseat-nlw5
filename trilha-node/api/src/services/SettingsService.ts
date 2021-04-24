import { getCustomRepository } from 'typeorm';
import { SettingsRepository } from '../repositories/SettingsRepository';

type SettingsServiceCreateParams = {
  chat: boolean;
  username: string;
};

export class SettingsService {
  private settingsRepository: SettingsRepository;

  async create({ chat, username }: SettingsServiceCreateParams) {
    this.settingsRepository = getCustomRepository(SettingsRepository);

    const usernameAlreadyExists = await this.settingsRepository.findOne({
      username,
    });
    if (usernameAlreadyExists) {
      throw new Error('User already exists!');
    }

    const settings = this.settingsRepository.create({
      username,
      chat,
    });

    await this.settingsRepository.save(settings);

    return settings;
  }
}
