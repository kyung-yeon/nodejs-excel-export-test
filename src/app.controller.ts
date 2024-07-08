import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/sync')
  getExcelSync(@Res() res: Response) {
    return this.appService.getSync(res);
  }


  @Get('/stream')
  getExcelFileStream(@Res() res: Response) {
    return this.appService.getAsync(res);
  }
}
