import { Controller, Param, Post } from '@nestjs/common';
import {
  Public,
  ResponseMessage,
  skipCheckPermission,
} from 'src/decorator/customize';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  // @Post('to-staff')
  // @ResponseMessage('Send an email')
  // toStaff() {
  //   return this.mailService.toStaff();
  // }

  // @Post('to-client/:id')
  // @ResponseMessage('Send an email')
  // toClient(@Param('id') id: string) {
  //   return this.mailService.toClient(id);
  // }

  @skipCheckPermission()
  @Post('appointment/:id')
  @ResponseMessage('Send an email')
  sendEmail(@Param('id') id: string) {
    return this.mailService.notify(id);
  }
}
