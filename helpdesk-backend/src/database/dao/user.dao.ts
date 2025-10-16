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
            id AS user_id,
            password,
            email,
            role,
            pfp,
            name
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

  public async getExtendedUserById(id): Promise<User[]> {
    try {
      const sql = `
          SELECT
            u.id AS user_id,
            u.name,
            u.email,
            u.pfp,
            u.role,
            u.password,
            COALESCE(CASE WHEN u.role = 'admin' THEN a.id ELSE NULL END,
                     CASE WHEN u.role = 'client' THEN c.id ELSE NULL END,
                     CASE WHEN u.role = 'technician' THEN t.id ELSE NULL END) AS role_id,
            CASE WHEN u.role = 'technician' THEN t.working_hours ELSE NULL END AS technician_working_hours
          FROM
            user u
          LEFT JOIN admin a ON u.id = a.user AND u.role = 'admin'
          LEFT JOIN client c ON u.id = c.user AND u.role = 'client'
          LEFT JOIN technician t ON u.id = t.user AND u.role = 'technician';
          WHERE
            u.id = ?
        `;
      return await this.dbConnection.query(sql, [id]);
    } catch (err) {
      this.logger.error(`Error finding user with id ${id}: ${err}`);
      return [];
    }
  }
}
