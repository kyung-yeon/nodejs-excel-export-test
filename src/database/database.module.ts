import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseRepository } from './database.repository';

@Module({
  imports: [],
  providers: [DatabaseService, DatabaseRepository],
  exports: [DatabaseService]
})
export class DatabaseModule { }
