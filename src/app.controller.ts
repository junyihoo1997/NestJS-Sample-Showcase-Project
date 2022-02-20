import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
      private readonly i18n: I18nService
  ) {}

  @Get('api/v1/health')
  async healthCheck() {
    return {
      statusCode: 200,
      message: await this.i18n.translate('general.success')
    };
  }
}
