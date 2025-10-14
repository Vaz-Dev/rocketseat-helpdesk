import { Module, Global, Logger } from '@nestjs/common';
import { DatabaseService } from './db-connection';

@Global()
@Module({
  providers: [{ provide: 'DBConnection', useClass: DatabaseService }, Logger],
  exports: ['DBConnection'],
})
export class DatabaseModule {}
