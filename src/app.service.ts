import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import * as exceljs from 'exceljs';
import { Response } from 'express';
import { Stream, Transform } from 'stream';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) { }

  getHeaders() {
    return [
      { header: '주문번호', key: 'orderId', width: 20 },
      { header: '주문자 이름', key: 'ordererName', width: 20 },
      { header: '주문자 나이', key: 'ordererAge', width: 20 },
      { header: '주문자 주소', key: 'ordererAddress', width: 20 },
      { header: '주문 총 원금액', key: 'orderOriginPrice', width: 20 },
      { header: '주문 총 할인금액', key: 'orderPrice', width: 20 },
      { header: '주문 총 결제 후 금액', key: 'paidPrice', width: 20 },
      { header: '상품명 나열', key: 'productNames', width: 20 },
      { header: '상품 카테고리 나열', key: 'productCategoryNames', width: 20 },
      { header: '상품 총 원금액 합계', key: 'productOriginPrice', width: 20 },
      { header: '상품 총 할인 후 금액 합계', key: 'productPrice', width: 20 },
      { header: '주문 일자', key: 'orderDate', width: 20 },
    ];
  }

  async getSync(res: Response) {
    const list = await this.databaseService.getSync();

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = this.getHeaders();

    for (const row of list) {
      worksheet.addRow(row);
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'excel-sync.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  getAsync(res: Response) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel-stream.xlsx');

    const passThrough = new Stream.PassThrough();
    passThrough.pipe(res);

    const listStream = this.databaseService.getAsync();

    const workbook = new exceljs.stream.xlsx.WorkbookWriter({
      stream: passThrough,
      useStyles: true,
      useSharedStrings: true
    });
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = this.getHeaders();

    listStream.on('data', (data) => {
      console.log('data', data)
      worksheet.addRow(data).commit();
    });

    listStream.on('end', async () => {
      await workbook.commit();
      passThrough.end();
    });
  }
}
