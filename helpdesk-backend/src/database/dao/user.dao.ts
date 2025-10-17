import {
  Injectable,
  Logger,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './interface';
import { DBConnection } from '../db-connection';

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
          LEFT JOIN technician t ON u.id = t.user AND u.role = 'technician'
          WHERE
            u.id = ?
        `;
      if (id) {
        return await this.dbConnection.query(sql, [id]);
      } else {
        throw new InternalServerErrorException(
          `Intercepted invalid query to the database.`,
        );
      }
    } catch (err) {
      this.logger.error(`Error finding user with id ${id}: ${err}`);
      return [];
    }
  }

  public async addAdmin(data: User): Promise<boolean> {
    try {
      const sqlUser = `
          INSERT INTO
            user
              (id, name, password, email, role)
            VALUES
              (?, ?, ?, ?, 'admin');
        `;
      await this.dbConnection.query(sqlUser, [
        data.user_id,
        data.name,
        data.password,
        data.email,
      ]);
      const sqlAdmin = `
        INSERT INTO
          admin
            (id, user)
          VALUES
            (?, ?);
        `;
      await this.dbConnection.query(sqlAdmin, [data.role_id, data.user_id]);
      return true;
    } catch (err) {
      this.logger.error(`Error adding new user of role '${data.role}': ${err}`);
      return false;
    }
  }

  public async addClient(data: User): Promise<boolean> {
    try {
      const sqlUser = `
              INSERT INTO
                user
                  (id, name, password, email, role)
                VALUES
                  (?, ?, ?, ?, 'client');
            `;
      await this.dbConnection.query(sqlUser, [
        data.user_id,
        data.name,
        data.password,
        data.email,
      ]);
      const sqlClient = `
            INSERT INTO
              client
                (id, user)
              VALUES
                (?, ?);
            `;
      await this.dbConnection.query(sqlClient, [data.role_id, data.user_id]);
      return true;
    } catch (err) {
      this.logger.error(`Error adding new user of role '${data.role}': ${err}`);
      return false;
    }
  }

  public async addTechnician(data: User): Promise<boolean> {
    try {
      const sqlUser = `
                INSERT INTO
                  user
                    (id, name, password, email, role)
                  VALUES
                    (?, ?, ?, ?, 'technician');
              `;
      await this.dbConnection.query(sqlUser, [
        data.user_id,
        data.name,
        data.password,
        data.email,
      ]);
      const sqlTechnician = `
              INSERT INTO
                technician
                  (id, user, working_hours)
                VALUES
                  (?, ?, ?);
              `;
      await this.dbConnection.query(sqlTechnician, [
        data.role_id,
        data.user_id,
        data.working_hours,
      ]);
      return true;
    } catch (err) {
      this.logger.error(`Error adding new user of role '${data.role}': ${err}`);
      return false;
    }
  }

  public async updateUser(data: User): Promise<boolean> {
    try {
      const sql = `
          UPDATE
            user
          SET
            name = ?,
            password = ?,
            pfp = ?
          WHERE
            id = ?
        `;
      await this.dbConnection.query(sql, [
        data.name,
        data.password,
        data.pfp,
        data.user_id,
      ]);
      if (data.role == 'technician') {
        const sqlTechnician = `
            UPDATE
              technician
            SET
              working_hours = ?
            WHERE
              id = ?
          `;
        await this.dbConnection.query(sqlTechnician, [
          data.working_hours,
          data.role_id,
        ]);
      }
      return true;
    } catch (err) {
      this.logger.error(`Error updating user '${data.email}' info: ${err}`);
      return false;
    }
  }
}
