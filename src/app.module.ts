import { Module, OnModuleDestroy, MiddlewareConsumer } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import databaseConfig from './configs/database.config';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { ProductModule } from './modules/product/product.module';
import {join} from "path";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (): MikroOrmModuleOptions => databaseConfig,
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        parserOptions: {
          path: join(__dirname, '../i18n/'),
        },
      }),
      parser: I18nJsonParser,
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleDestroy {
  constructor(private orm: MikroORM) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }

  onModuleDestroy() {
    this.orm.close();
  }
}
