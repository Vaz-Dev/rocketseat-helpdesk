import { Inject, Injectable, Logger } from '@nestjs/common';
import { DBConnection } from '../database.service';
import { ServiceType } from './interface';

@Injectable()
export class ServiceTypeDAO {
  private readonly logger = new Logger(ServiceTypeDAO.name);

  constructor(
    @Inject('DBConnection') private readonly dbConnection: DBConnection,
  ) {}

  public async addServiceType(data: ServiceType): Promise<boolean> {
    try {
      const sql = `
          INSERT INTO
            service_type
              (name, value)
            VALUES
              (?, ?)
        `;
      await this.dbConnection.query(sql, [data.name, data.value]);
      return true;
    } catch (err) {
      this.logger.error(
        `Error while adding service type '${data.name}: ${err}'`,
      );
      return false;
    }
  }

  public async getAllServiceTypes(): Promise<ServiceType[]> {
    try {
      const sql = `
          SELECT
            id, name, value
          FROM
            service_type
        `;
      return await this.dbConnection.query(sql, []);
    } catch (err) {
      this.logger.error(`Error while getting service type list: ${err}`);
      return [];
    }
  }

  public async getServiceType(id): Promise<ServiceType[]> {
    try {
      const sql = `
            SELECT
              id, name, value
            FROM
              service_type
            WHERE
              id = ?
          `;
      return await this.dbConnection.query(sql, [id]);
    } catch (err) {
      this.logger.error(`Error while getting service type: ${err}`);
      return [];
    }
  }

  public async updateServiceType(data: ServiceType): Promise<boolean> {
    try {
      const sql = `
        UPDATE
          service_type
        SET
          name = ?,
          value = ?
        WHERE
          id = ?
      `;
      await this.dbConnection.query(sql, [data.name, data.value, data.id]);
      return true;
    } catch (err) {
      this.logger.error(
        `Error while updating service type '${data.id}': ${err}`,
      );
      return false;
    }
  }

  public async deleteServiceType(id): Promise<boolean> {
    try {
      const sql = `
          DELETE FROM
            service_type
          WHERE
            id = ?
        `;
      await this.dbConnection.query(sql, [id]);
      return true;
    } catch (err) {
      this.logger.error(`Error while deleting service type '${id}: ${err}'`);
      return false;
    }
  }
}
