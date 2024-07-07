import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) { }

  getExcelFile() {
    return this.databaseService.getFile();
  }

  getExcelFileStream() {
    return 'Hello World! - getExcelFileStream';
  }
}
