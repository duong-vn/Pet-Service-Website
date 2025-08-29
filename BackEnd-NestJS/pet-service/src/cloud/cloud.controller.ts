import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { Public, skipCheckPermission } from 'src/decorator/customize';
import { CloudService } from './cloud.service';

@Controller('cloud')
export class CloudController {
  constructor(private cloudService: CloudService) {}
  @Public()
  @Post('sign')
  upload(
    @Body('folder') folder: string,
    @Body('public_id')
    publicId?: string,
  ) {
    return this.cloudService.sign(folder, publicId);
  }

  @Delete('delete')
  delete(@Query('public_id') public_id: string) {
    return this.cloudService.delete(public_id);
  }
}
