import { Module } from '@nestjs/common';
import { EmailSendingService } from './email-sending.service';

@Module({
  //   imports: [],
  providers: [EmailSendingService],
  exports: [EmailSendingService],
})
export class EmailServiceModule {}
