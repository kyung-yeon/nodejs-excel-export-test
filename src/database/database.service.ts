import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';
import { PassThrough, Transform } from 'stream';

@Injectable()
export class DatabaseService {
  constructor(private readonly databaseRepository: DatabaseRepository) {}

  before() {
    console.time('query time');
  }
  after() {
    console.timeEnd('query time');
  }

  async sync () {
    this.before();
    const result = await this.databaseRepository.getSyncData()
    this.after();
    return result;
  }

  stream (): PassThrough {
    this.before();
    const result = this.databaseRepository.getStreamData()
    this.after();
    return result;
  }

  transform (userMap, categoryMap): PassThrough {
    this.before();
    console.log('c');
    return this.databaseRepository.getTransformData().pipe(
      new Transform({
        readableObjectMode: true,
        writableObjectMode: true,
        transform(row, encoding, callback) {
          try {
            const user = userMap.get(row.userId);
            // const category = categoryMap.get(row.categoryId);

            const line = {
              ...row,
              ordererName: user?.name ?? '-',
              ordererAge: user?.age ?? '-',
              ordererAddress: user?.address ?? '-',
              productCategoryNames: '-',
            };

            this.push(line);
            callback();
          } catch(err) {
            console.log('err', err);
          }
        },
      })
    );
  }

  async findOrderUserIds () {
    return this.databaseRepository.findOrderUserIds()
  }

  async findCategories () {
    return this.databaseRepository.findCategories()
  }

  async findOrdersByUserIds (userIds) {
    return this.databaseRepository.findOrdersByUserIds(userIds)
  }
}