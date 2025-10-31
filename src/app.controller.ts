import { Controller, Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Controller()
export class AppModule {}
