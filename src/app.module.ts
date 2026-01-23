import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { EmailServiceModule } from './email-service/email-service.module';
import { TelegramModule } from './telegram/telegram.module';
import { PartnersController } from './partners/partners.controller';
import { PartnerService } from './partners/partners.service';
import { PartnersModule } from './partners/partners.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    AuthModule,
    OrdersModule,
    AuthModule,
    OrdersModule,
    EmailServiceModule,
    TelegramModule,
    PartnersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // type: 'sqlite', //  for local testing only
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true, //  do not use true for the prod
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
