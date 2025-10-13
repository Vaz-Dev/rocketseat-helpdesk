import { Logger, Injectable } from '@nestjs/common';

import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();

@Injectable()
export class DatabaseService {
  private db = new sql3.Database(
    './src/database/db.sqlite',
    sqlite3.OPEN_READWRITE,
    this.instanceErrorHandler.bind(this),
  );

  private logger = new Logger(DatabaseService.name);

  query(sql: string, ...data) {
    this.db.run(sql, [...data], this.queryErrorHandler.bind(this));
  }

  private instanceErrorHandler(err) {
    if (err) {
      this.logger.error(`Error creating database instance: ${err}`);
    } else {
      this.logger.debug(`Database instance successfully initiated.`);
    }
  }

  private queryErrorHandler(err) {
    if (err) {
      this.logger.error(`Error sending query to database: ${err}`);
    } else {
      this.logger.debug(`Database query successful.`);
    }
  }
}

export abstract class DBConnection {
  abstract query(sql: string, data: any[]): any;
}
