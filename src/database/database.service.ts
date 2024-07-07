import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from './database.repository';

@Injectable()
export class DatabaseService {
  constructor(private readonly repository: ConnectionRepository) { }

  getFile() {
    return this.repository.getData();
  }
}
