import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';
import { ConfigModule } from '@nestjs/config';
import { AtGuard, RolesGuard } from './common/guards';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PostgresConfigService } from './config/postgres.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'STRIPE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.STRIPE_URL],
            queue: process.env.STRIPE_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'CHECKOUT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.CHECKOUT_URL],
            queue: process.env.CHECKOUT_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
