import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';

@Injectable()
export class DatabaseService {
  constructor(private readonly repository: DatabaseRepository) { }

  getFile() {
    return this.repository.getData();
  }
}
