import { Controller, Delete } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}
  @Delete('all-data')
  async delAllData() {
    return await this.testingService.delAllData();
  }
}
