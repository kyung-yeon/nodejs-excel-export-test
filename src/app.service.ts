import { Injectable } from '@nestjs/common';
import * as exceljs from 'exceljs';
import { Response } from 'express';
import { PassThrough, Transform } from 'stream';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  getHeaders() {
    return [
      { header: '주문번호', key: 'orderId', width: 20 },
      { header: '주문자 이름', key: 'ordererName', width: 20 },
      { header: '주문자 나이', key: 'ordererAge', width: 20 },
      { header: '주문자 주소', key: 'ordererAddress', width: 20 },
      { header: '주문 총 원금액', key: 'orderOriginPrice', width: 20 },
      { header: '주문 총 할인금액', key: 'orderPrice', width: 20 },
      { header: '주문 개수', key: 'productCount', width: 20 },
      { header: '주문 총 결제 후 금액', key: 'paidPrice', width: 20 },
      { header: '상품명 나열', key: 'productNames', width: 20 },
      { header: '상품 카테고리 나열', key: 'productCategoryNames', width: 20 },
      { header: '상품 총 원금액 합계', key: 'productOriginPrice', width: 20 },
      { header: '상품 총 할인 후 금액 합계', key: 'productPrice', width: 20 },
      { header: '주문 일자', key: 'orderDate', width: 20 },
    ];
  }

  async getSync(res: Response) {
    const list = await this.databaseService.sync();
    console.time('excel time');

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = this.getHeaders();

    console.log('state 1');
    for (const row of list) {
      worksheet.addRow(row).commit();
    }
    console.log('state 2');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'excel-sync.xlsx',
    );

    console.log('state 3');
    await workbook.xlsx.write(res);
    console.log('state 4');
    console.timeEnd('excel time');
    res.end();
  }

  getAsync(res: Response) {
    const listStream = this.databaseService.stream();
    console.time('excel time');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel-transform.xlsx');

    const passThrough = new PassThrough();
    passThrough.pipe(res);


    const workbook = new exceljs.stream.xlsx.WorkbookWriter({
      stream: passThrough,
      useStyles: true,
      useSharedStrings: true
    });
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = this.getHeaders();

    listStream.on('data', (data) => {
      worksheet.addRow(data).commit();
    });

    listStream.on('end', async () => {
      await workbook.commit();
      console.timeEnd('excel time');
      passThrough.end();
    });
  }

  async getTransform() {
    const [orderUserIds, categories] = await Promise.all([
      this.databaseService.findOrderUserIds(),
      this.databaseService.findCategories(),
    ])
    const userIds = orderUserIds.map(({ userId }) => userId);
    const users = await this.databaseService.findOrdersByUserIds(userIds)
    const userMap = new Map(users.map((user) => [user.userId, user]));
    const categoryMap = new Map(categories.map((category) => [category.categoryId, category]));

    console.log('users', users[0]);
    console.log('userMap', userMap.get(users[0].userId));


    const listStream = this.databaseService.transform(userMap, categoryMap);
    console.timeEnd('query time');
    return listStream;
  }
}
