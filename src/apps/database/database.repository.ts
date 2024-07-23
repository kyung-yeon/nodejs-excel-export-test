import { Injectable } from "@nestjs/common";
import knex, { Knex } from 'knex';
import { postProcessResponse, wrapIdentifier } from './support';
import { ConfigService } from "@nestjs/config";
import { PassThrough } from 'stream';
import { EXPORT_DATA_LIMIT } from '../constants';

@Injectable()
export class DatabaseRepository {
    private readonly db: Knex;

    constructor(private readonly configService: ConfigService) {
        this.db = knex({
            client: 'mysql2',
            connection: {
                host: configService.get('MYSQL_HOST'),
                port: +configService.get('MYSQL_PORT'),
                user: configService.get('MYSQL_USER'),
                password: configService.get('MYSQL_PASSWORD'),
                database: configService.get('MYSQL_DATABASE'),
                dateStrings: true,
                namedPlaceholders: true,
            },
            pool: {
                min: 1,
                max: 500,
            },
            acquireConnectionTimeout: 1000 * 10,
            debug: false,
            postProcessResponse,
            wrapIdentifier,
        });
    }

    async getExcelData() {
        return this.db({ o: 'orders' })
            .innerJoin({ od: 'orders_detail' }, { 'o.orders_id': 'od.orders_id' })
            .innerJoin({ pa: 'payment' }, { 'o.orders_id': 'pa.orders_id' })
            .innerJoin({ p: 'product' }, { 'od.product_id': 'p.product_id' })
            .innerJoin({ pd: 'product_detail' }, { 'p.product_id': 'pd.product_id' })
            .innerJoin({ c: 'category' }, { 'p.category_id': 'c.category_id' })
            .innerJoin({ u: 'user' }, { 'o.user_id': 'u.user_id' })
            .select({
                orderId: 'o.orders_id',
                ordererName: 'u.name',
                ordererAge: 'u.age',
                ordererAddress: 'u.address',
                orderOriginPrice: 'o.origin_price',
                orderPrice: 'o.price',
                paidPrice: 'pa.price',
                productNames: this.db.raw('group_concat(pd.name)'),
                productCategoryNames: this.db.raw('group_concat(c.name)'),
                orderDate: 'o.created_at',
            })
            .count({
              productCount: '*'
            })
            .sum({
                productOriginPrice: 'pd.origin_price',
                productPrice: 'pd.price',
            })
            .groupBy(['o.orders_id'])
            .limit(EXPORT_DATA_LIMIT)
    }

    getStreamData(): PassThrough {
        return this.db({ o: 'orders' })
            .innerJoin({ od: 'orders_detail' }, { 'o.orders_id': 'od.orders_id' })
            .innerJoin({ pa: 'payment' }, { 'o.orders_id': 'pa.orders_id' })
            .innerJoin({ p: 'product' }, { 'od.product_id': 'p.product_id' })
            .innerJoin({ pd: 'product_detail' }, { 'p.product_id': 'pd.product_id' })
            .innerJoin({ c: 'category' }, { 'p.category_id': 'c.category_id' })
            .innerJoin({ u: 'user' }, { 'o.user_id': 'u.user_id' })
            .select({
                orderId: 'o.orders_id',
                ordererName: 'u.name',
                ordererAge: 'u.age',
                ordererAddress: 'u.address',
                orderOriginPrice: 'o.origin_price',
                orderPrice: 'o.price',
                paidPrice: 'pa.price',
                productNames: this.db.raw('group_concat(pd.name)'),
                productCategoryNames: this.db.raw('group_concat(c.name)'),
                orderDate: 'o.created_at',
            })
            .count({
              productCount: '*'
            })
            .sum({
                productOriginPrice: 'pd.origin_price',
                productPrice: 'pd.price',
            })
            .groupBy(['o.orders_id'])
            .limit(EXPORT_DATA_LIMIT)
            .stream()
    }

  getTransformData() {
    return this.db({ o: 'orders' })
      .innerJoin({ od: 'orders_detail' }, { 'o.orders_id': 'od.orders_id' })
      .innerJoin({ pa: 'payment' }, { 'o.orders_id': 'pa.orders_id' })
      .innerJoin({ p: 'product' }, { 'od.product_id': 'p.product_id' })
      .innerJoin({ pd: 'product_detail' }, { 'p.product_id': 'pd.product_id' })
      // .innerJoin({ c: 'category' }, { 'p.category_id': 'c.category_id' })
      // .innerJoin({ u: 'user' }, { 'o.user_id': 'u.user_id' })
      .select({
        orderId: 'o.orders_id',
        // ordererName: 'u.name',
        // ordererAge: 'u.age',
        // ordererAddress: 'u.address',
        orderOriginPrice: 'o.origin_price',
        orderPrice: 'o.price',
        paidPrice: 'pa.price',
        productNames: this.db.raw('group_concat(pd.name)'),
        // productCategoryNames: this.db.raw('group_concat(c.name)'),
        categoryIds: this.db.raw('group_concat(p.category_id)'),
        orderDate: 'o.created_at',
        userId: 'o.userId',
      })
      .count({
        productCount: '*'
      })
      .sum({
        productOriginPrice: 'pd.origin_price',
        productPrice: 'pd.price',
      })
      .groupBy(['o.orders_id'])
      .limit(EXPORT_DATA_LIMIT)
      .stream()
  }

    async bulkInsert(table: string, data: unknown[]) {
        console.time('insert - [' + table + '] rows -> ' + data.length);
        await this.db.batchInsert(table, data);
        console.timeEnd('insert - [' + table + '] rows -> ' + data.length);
    }

    async findOrderUserIds() {
      return this.db('orders').select('userId').limit(EXPORT_DATA_LIMIT);
    }

    async findCategories() {
      return this.db('category').select();
    }

    async findUsersByUserIds(userIds) {
      return this.db('user').whereIn('userId', userIds).select();
    }
}