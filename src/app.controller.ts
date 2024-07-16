import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { PassThrough } from 'stream';
import * as exceljs from 'exceljs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

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

  @Get('/sync')
  sync(@Res() res: Response) {
    try {
      return this.appService.getSync(res);
    } catch(err) {
      console.log('err', err);
    }
  }

  @Get('/stream')
  stream(@Res() res: Response) {
    return this.appService.getAsync(res);
  }

  @Get('/transform')
  async transform(@Res() res: Response) {
    const resultStream = await this.appService.getTransform();

    console.log('--?');
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

    resultStream.on('data', (data) => {
      worksheet.addRow(data).commit();
    });

    resultStream.on('end', async () => {
      console.log('end!');
      await workbook.commit();
      console.timeEnd('excel time');
      passThrough.end();
    });
  }
}
