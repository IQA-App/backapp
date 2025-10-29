// import { Controller, Get } from '@nestjs/common';
// // import { AppService } from './app.service';

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { message: 'Hello world' };
  }
}
