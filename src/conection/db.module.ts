import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME_NEST;
@Module({
  imports: [MongooseModule.forRoot(mongoUri + '/' + dbName)],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
