import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { PassThrough } from 'stream';
import * as exceljs from 'exceljs';
import { getExcelHeaders } from './helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/sync')
  async sync(@Res() res: Response) {
    const list = await this.appService.getSync();

    console.time('excel time');

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = getExcelHeaders();

    for (const row of list) {
      worksheet.addRow(row).commit();
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
    console.timeEnd('excel time');
    res.end();
  }

  @Get('/stream')
  stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel-transform.xlsx');

    const passThrough = new PassThrough();
    passThrough.pipe(res);

    const listStream = this.appService.getAsync();
    console.time('excel time');

    const workbook = new exceljs.stream.xlsx.WorkbookWriter({
      stream: passThrough,
      useStyles: true,
      useSharedStrings: true
    });
    const worksheet = workbook.addWorksheet('Sheet');
    worksheet.columns = getExcelHeaders();

    listStream.on('data', (data) => {
      worksheet.addRow(data).commit();
    });

    listStream.on('end', async () => {
      await workbook.commit();
      console.timeEnd('excel time');
      passThrough.end();
    });
  }

  @Get('/transform')
  async transform(@Res() res: Response) {
    const resultStream = await this.appService.getTransform();
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
    worksheet.columns = getExcelHeaders();

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
