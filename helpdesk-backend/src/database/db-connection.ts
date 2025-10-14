import { Logger, Injectable } from '@nestjs/common';

import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();

@Injectable()
export class DatabaseService {
  constructor(private readonly logger: Logger) {}

  private db = new sql3.Database(
    './src/database/db.sqlite',
    sqlite3.OPEN_READWRITE,
    this.instanceErrorHandler.bind(this),
  );

  async query(sql: string, ...data): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, ...data, (err, rows: any[]) => {
        if (err) {
          this.logger.error(`Error sending query to database: ${err}`);
          return reject(new Error(err));
        } else {
          return resolve(rows);
        }
      });
    });
  }

  private instanceErrorHandler(err) {
    if (err) {
      this.logger.error(`Error creating database instance: ${err}`);
    } else {
      this.logger.debug(`Database instance successfully initiated.`);
    }
  }
}

export abstract class DBConnection {
  abstract query(sql: string, data: any[]): any;
}
