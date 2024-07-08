import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';

@Injectable()
export class DatabaseService {
  constructor(private readonly repository: DatabaseRepository) { }

  async getSync() {
    return this.repository.getSyncData();
  }

  getAsync() {
    return this.repository.getAsyncData();
  }
}
