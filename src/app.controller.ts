import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/file')
  getExcelFile() {
    return this.appService.getExcelFile();
  }


  @Get('/stream')
  getExcelFileStream() {
    return this.appService.getExcelFileStream();
  }
}
