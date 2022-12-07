import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './infrastructure/conection/db-connect';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  await runDb();
  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port: ${process.env.PORT || 5000}`);
  });
}
bootstrap();
