import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.HEADER,
    defaultVersion: '1',
    header: 'version',
  });

  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 206,
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-origin',
      'Origin',
      'Accept',
      'X-Requested-With',
      'Authorization',
      'Accept-Language',
      'Content-Type',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'version',
    ],
    origin: [
      'https://test.mysmartgene.com',
      'http://localhost:3000',
      'http://localhost:4321',
    ],
  });
  app.use(
    helmet({
      hidePoweredBy: true,
      xXssProtection: true,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, `data: 'localhost:3000'`],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );
  app.set('trust proxy', true);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax', maxAge: 3_600_000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const openAPIConfig = new DocumentBuilder()
    .setTitle('my-app')
    .setDescription('')
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: 'version',
      schema: {
        default: '1',
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, openAPIConfig);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
