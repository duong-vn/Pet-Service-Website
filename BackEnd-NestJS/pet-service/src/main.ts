import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import helmet from 'helmet';
import { TrimStringsPipe } from './core/trim-string.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  //config cors
  app.enableCors({
    origin: [
      configService.getOrThrow<string>('FE_BASE_URL') ??
        'http://localhost:3000',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
  });

  app.use(helmet());

  await app.listen(configService.get<string>('PORT') ?? 8080);
}

bootstrap();
