import { Controller, Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
