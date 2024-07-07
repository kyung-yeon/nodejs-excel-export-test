import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConnectionRepository } from './database.repository';

@Module({
  imports: [],
  providers: [DatabaseService, ConnectionRepository],
  exports: [DatabaseService]
})
export class DatabaseModule { }
