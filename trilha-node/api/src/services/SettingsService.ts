import { getCustomRepository } from 'typeorm';
import { SettingsRepository } from '../repositories/SettingsRepository';

type SettingsServiceCreateParams = {
  chat: boolean;
  username: string;
};

export class SettingsService {
  private settingsRepository: SettingsRepository;

  async save({ chat, username }: SettingsServiceCreateParams) {
    this.settingsRepository = getCustomRepository(SettingsRepository);

    let settings = await this.settingsRepository.findOne({
      username,
    });
    if (!settings) {
      settings = this.settingsRepository.create({
        username,
        chat,
      });
    } else {
      settings.chat = chat;
    }

    await this.settingsRepository.save(settings);

    return settings;
  }

  async findByUsername(username: string) {
    this.settingsRepository = getCustomRepository(SettingsRepository);

    const settings = await this.settingsRepository.findOne({ username });

    return settings;
  }
}
