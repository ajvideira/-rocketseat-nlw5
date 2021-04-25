import { getCustomRepository, QueryBuilder } from 'typeorm';
import { Connection } from '../entities/connection';
import { ConnectionsRepository } from '../repositories/ConnectionsRepository';
import { MessagesRepository } from '../repositories/MessagesRepository';

type ConnectionsServiceCreateParams = {
  id?: string;
  user_id: string;
  admin_id?: string;
  socket_id: string;
};

export class ConnectionsService {
  private connectionsRepository: ConnectionsRepository;

  async save({
    user_id,
    admin_id,
    socket_id,
    id,
  }: ConnectionsServiceCreateParams) {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);

    const connection = this.connectionsRepository.create({
      user_id,
      admin_id,
      socket_id,
      id,
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  async finByUser(user_id: string) {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);

    const connection = await this.connectionsRepository.findOne({
      user_id,
    });

    return connection;
  }

  async findAllWithoutAdmin() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);

    const connections = await this.connectionsRepository.find({
      where: { admin_id: null },
      relations: ['user'],
    });

    return connections;
  }

  async findBySocketID(socket_id: string) {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);

    const connection = await this.connectionsRepository.findOne({
      where: { socket_id },
      relations: ['user'],
    });

    return connection;
  }

  async updateAdminID(user_id: string, admin_id: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where('user_id = :user_id', { user_id })
      .execute();
  }
}
