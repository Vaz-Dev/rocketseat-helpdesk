import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServiceTypeModule } from './modules/service_type/service_type.module';
import { ConfigModule } from '@nestjs/config';
import { ServiceCallModule } from './modules/service_call/service_call.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ServiceTypeModule,
    ConfigModule.forRoot(),
    ServiceCallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
