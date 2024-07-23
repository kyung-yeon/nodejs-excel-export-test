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

  transform (userMap, categories): PassThrough {
    this.before();
    const pipe = this.databaseRepository.getTransformData().pipe(
      new Transform({
        readableObjectMode: true,
        writableObjectMode: true,
        transform(row, encoding, callback) {
          try {
            // console.log('============================');
            const user = userMap.get(row.userId);
            // // console.log('user', row.userId, user);
            // const category = categoryMap.get(row.categoryId);

            const rowCategories = row.categoryIds.split(',')
            // console.log('rowCategories', rowCategories);
            const targetCategories = categories.filter(c => rowCategories.includes(c.categoryId.toString()))
            // console.log('targetCategories', targetCategories);

            const line = {
              ...row,
              ordererName: user?.name ?? '-',
              ordererAge: user?.age ?? '-',
              ordererAddress: user?.address ?? '-',
              productCategoryNames: targetCategories.map(c => c.name).join(',') ?? '-',
            };

            this.push(line);
            callback();
          } catch(err) {
            console.log('err', err);
          }
        },
      })
    );
    this.after();
    return pipe;
  }

  async findOrderUserIds () {
    return this.databaseRepository.findOrderUserIds()
  }

  async findCategories () {
    return this.databaseRepository.findCategories()
  }

  async findUsersByUserIds (userIds) {
    return this.databaseRepository.findUsersByUserIds(userIds)
  }
}