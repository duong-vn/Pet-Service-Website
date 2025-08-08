import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ServicesModule } from './services/services.module';
import { MailModule } from './mail/mail.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { DatabaseModule } from './database/database.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TimeslotsModule } from './timeslots/timeslots.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
    }),
    UsersModule,
    ServicesModule,
    MailModule,
    RolesModule,
    PermissionsModule,
    DatabaseModule,
    AppointmentsModule,
    TimeslotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
