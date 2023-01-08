import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalErrorHanlder } from './global-error-hanlder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Set the ValidationPipe as a global pipe to validate the request body or query parameters of all routes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  //  adds the swagger documentation to the backend
  const config = new DocumentBuilder()
    .setTitle('FT_TRANSCENDENCE')
    .setDescription('The API description of auth')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: process.env.route_frontend,
    credentials: true,
  });

  app.useGlobalFilters(new GlobalErrorHanlder());
  await app.listen(8000);
}
bootstrap();
