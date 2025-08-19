import { Controller, HttpCode, Param, Post } from '@nestjs/common';
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
  // @Public()
  // @Post('test')
  // test() {
  //   return this.mailService.toVerify({
  //     url: 'http://localhost:3000/auth/verify#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWdpYyB0b2tlbiIsImlzcyI6InNlcnZlciIsIl9pZCI6IjY4YTA0YjM1MzdjNDBiZTkxYTQ4ODEyYyIsImlhdCI6MTc1NTMzNTQ3NywiZXhwIjoxNzU1MzM1Nzc3fQ.1TDJxLgEVA-scxPNCSClyR5Jsfu2ObWRje-kc9QVSQE',
  //     name: 'duong',
  //     email: 'duongnguyenhust05@gmail.com',
  //   });
  // }

  @Post('appointment/:id')
  @HttpCode(200)
  @ResponseMessage('Send an email')
  sendEmail(@Param('id') id: string) {
    return this.mailService.notify(id);
  }
}
