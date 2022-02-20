import { Logger, UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ErrorHandler } from './handlers/error.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors();

    // Setup validation error to 422
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors),
    }));

    app.useGlobalInterceptors(new ErrorHandler());

  // Swagger
  const swaggerConfigs = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('This documentation covering all APIs for the Portfolio uses.')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, swaggerConfigs);
  SwaggerModule.setup('api/docs', app, document);

  // Import .env file
  const configService: ConfigService = app.get(ConfigService);

  // Start server
  await app.listen(
      3000,
      configService.get<string>('APP_HOST'),
      () => {
        Logger.verbose(`Web server is running on ${configService.get<string>('APP_HOST')}:${configService.get<number>('APP_PORT')}`, 'Portfolio');
      }
  );
}
bootstrap();
