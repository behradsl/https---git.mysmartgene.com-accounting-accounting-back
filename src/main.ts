import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'super_secured',
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
      cookie: {
        maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE || 3600000),
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('nestjs template')
    .setDescription('template api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
