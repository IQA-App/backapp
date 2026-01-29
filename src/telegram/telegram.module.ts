import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramPartnerData } from 'src/partners/entities/telegram-partnerData.entity';
import { PartnersModule } from 'src/partners/partners.module';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramPartnerData])],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
