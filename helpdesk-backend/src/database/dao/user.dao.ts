import { Injectable, Logger, Inject } from '@nestjs/common';
import { User } from './interface';
import { DBConnection } from '../db-connection';
import { LoginDto } from 'src/modules/auth/dto/LoginDto';

@Injectable()
export class UserDAO {
  private readonly logger = new Logger(UserDAO.name);

  constructor(
    @Inject('DBConnection') private readonly dbConnection: DBConnection,
  ) {}

  public async getUserByEmail(email): Promise<User[]> {
    try {
      const sql = `
          SELECT
            *
          FROM
            user
          WHERE
            email = ?
        `;
      return await this.dbConnection.query(sql, [email]);
    } catch (err) {
      this.logger.error(`Error finding user with email ${email}: ${err}`);
      return [];
    }
  }
}
