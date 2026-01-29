import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partners } from './entities/partners.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartnerService } from './partners.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partners]), TelegramModule],
  controllers: [PartnersController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnersModule {}
