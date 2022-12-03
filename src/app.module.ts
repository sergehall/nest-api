import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailsRecoveryCodeSchema,
  EmailsToSentSchema,
  UserSchema,
} from './infrastructure/database/schemes';
import { UsersService } from './features/users/users.service';
import { EmailsRepository } from './features/emails/emails.repository';
import { UsersRepository } from './features/users/users.repository';
import { DatabaseModule } from './conection/db.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema, collection: 'Users' },
      {
        name: 'MyModelEmailsConfirmCode',
        schema: EmailsToSentSchema,
        collection: 'EmailsConfirmationCode',
      },
      {
        name: 'MyModelEmailsRecoveryCode',
        schema: EmailsRecoveryCodeSchema,
        collection: 'EmailsRecoveryCode',
      },
    ]),
  ],
  controllers: [AppController, UsersController],
  providers: [UsersService, EmailsRepository, UsersRepository],
})
export class AppModule {}
