import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const timestamp = new Date().toISOString();

    try {
      await this.prisma.empresa.count();

      return {
        database: 'ok',
        status: 'ok',
        timestamp
      };
    } catch {
      throw new ServiceUnavailableException({
        database: 'error',
        status: 'error',
        timestamp
      });
    }
  }
}
