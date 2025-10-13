import { Injectable, Logger, Inject } from '@nestjs/common';
import { User } from './interface';
import { DBConnection } from '../db-connection';

@Injectable()
export class UserDAO {
  private readonly logger = new Logger(UserDAO.name);

  constructor(
    @Inject('DBConnection') private readonly dbConnection: DBConnection,
  ) {}

  public verifyAuth(email: string, password: string): any {
    try {
      const sql = `
          SELECT
            ID
          FROM
            user
          WHERE
            email = ?
          AND
            password = ?
        `;
      return this.dbConnection.query(sql, [email, password]);
    } catch (err) {
      this.logger.error(`Error during user authentication: ${err}`);
    }
  }
}
