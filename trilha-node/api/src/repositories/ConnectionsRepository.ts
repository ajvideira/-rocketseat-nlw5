import { EntityRepository, Repository } from 'typeorm';
import { Connection } from '../entities/connection';

@EntityRepository(Connection)
export class ConnectionsRepository extends Repository<Connection> {}
