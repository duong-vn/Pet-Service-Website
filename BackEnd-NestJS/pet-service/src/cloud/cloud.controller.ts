import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { Public, skipCheckPermission } from 'src/decorator/customize';
import { CloudService } from './cloud.service';

@Controller('cloud')
export class CloudController {
  constructor(private cloudService: CloudService) {}
  @Public()
  @Post('sign')
  upload(@Body('folder') folder: string) {
    // return this.cloudService.test();
    return this.cloudService.sign(folder);
  }

  @Delete('delete')
  delete(@Query('public_id') public_id: string) {
    // return this.cloudService.test();
    console.log(public_id);
    return this.cloudService.delete(public_id);
  }
}
