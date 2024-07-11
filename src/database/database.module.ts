import { Module } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';
import { DatabaseService } from './database.service';

@Module({
  imports: [],
  providers: [DatabaseService, DatabaseRepository],
  exports: [DatabaseService]
})
export class DatabaseModule { }
