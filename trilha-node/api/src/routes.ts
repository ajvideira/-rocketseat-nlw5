import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { SettingsController } from './controllers/SettingsControllers';
import { SettingsRepository } from './repositories/SettingsRepository';

const routes = Router();

const settingsController = new SettingsController();

routes.post('/settings', settingsController.create);

export default routes;
