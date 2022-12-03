import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './conection/db-connect';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
async function bootstrap() {
  await runDb();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  await app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
  });
}
bootstrap();
