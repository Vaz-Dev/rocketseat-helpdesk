import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './db-connection';

@Global()
@Module({
  providers: [{ provide: 'DBConnection', useClass: DatabaseService }],
  exports: ['DBConnection'],
})
export class DatabaseModule {}
