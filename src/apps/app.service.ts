import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  async getExcel() {
    return this.databaseService.excel();
  }

  getAsync() {
    return this.databaseService.stream();
  }

  async getTransform() {
    const [orderUserIds, categories] = await Promise.all([
      this.databaseService.findOrderUserIds(),
      this.databaseService.findCategories(),
    ])
    const userIds = orderUserIds.map(({ userId }) => userId);
    const users = await this.databaseService.findUsersByUserIds(userIds)
    const userMap = new Map(users.map((user) => [user.userId, user]));

    return this.databaseService.transform(userMap, categories);
  }
}
