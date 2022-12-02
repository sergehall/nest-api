import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './Users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailsRecoveryCodeSchema,
  EmailsToSentSchema,
  UserSchema,
} from './infrastructure/database/schemes';
import { UsersService } from './Users/users.service';
import { EmailsRepository } from './emails/emails.repository';
import { UsersRepository } from './Users/users.repository';
import { DatabaseModule } from './conection/db.module';

const collection = 'Users';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection },
      { name: 'MyModelEmailsConfirmCode', schema: EmailsToSentSchema },
      { name: 'MyModelEmailsRecoveryCode', schema: EmailsRecoveryCodeSchema },
    ]),
  ],
  controllers: [AppController, UsersController],
  providers: [UsersService, EmailsRepository, UsersRepository],
})
export class AppModule {}
