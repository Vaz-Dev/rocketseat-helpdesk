import { Module, Global, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [{ provide: 'DBConnection', useClass: DatabaseService }, Logger],
  exports: ['DBConnection'],
})
export class DatabaseModule {}
