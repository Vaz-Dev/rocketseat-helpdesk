import { Inject, Injectable, Logger } from '@nestjs/common';
import { DBConnection } from '../database.service';
import { ServiceCall } from './interface';

@Injectable()
export class ServiceCallDAO {
  private readonly logger = new Logger(ServiceCallDAO.name);

  constructor(
    @Inject('DBConnection') private readonly dbConnection: DBConnection,
  ) {}

  public async addServiceCall(data: ServiceCall): Promise<boolean> {
    try {
      const sql = `
          INSERT INTO
            service_call
              (service, client, technician, title, description, total_value)
            VALUES
              (?, ?, ?, ?, ?, ?)
        `;
      await this.dbConnection.query(sql, [
        data.service,
        data.client,
        data.technician,
        data.title,
        data.description,
        data.total_value,
      ]);
      return true;
    } catch (err) {
      this.logger.error(
        `Error while adding service call '${data.title}': ${err}`,
      );
      return false;
    }
  }

  public async getAllServiceCalls(): Promise<ServiceCall[]> {
    try {
      const sql = `
      SELECT
        id, title, service, updated_at, created_at, client, technician, total_value, status
      FROM
        service_call
    `;
      const result: ServiceCall[] = await this.dbConnection.query(sql, []);
      return result;
    } catch (err) {
      this.logger.error(`Error while getting service call list: ${err}`);
      return [];
    }
  }

  public async getServiceCallsByRoleId(id: string): Promise<ServiceCall[]> {
    // Clients and technicians are assigned to an service call using their role id, this function uses that to find their related calls.
    try {
      const sql = `
        SELECT
          id, title, service, updated_at, created_at, client, technician, total_value, status
        FROM
          service_call
        WHERE
          client = ?
        OR
          technician = ?
      `;
      const result: ServiceCall[] = await this.dbConnection.query(sql, [
        id,
        id,
      ]);
      return result;
    } catch (err) {
      this.logger.error(`Error while getting service call list: ${err}`);
      return [];
    }
  }

  public async getServiceCall(id: number): Promise<ServiceCall[]> {
    try {
      const sql = `
        SELECT
          id, title, description, updated_at, created_at, client, technician, total_value, status
        FROM
          service_call
        WHERE
          id = ?
        `;
      const result: ServiceCall[] = await this.dbConnection.query(sql, [id]);
      if (result.length > 1) {
        throw new Error(
          `Query using call id returned with array length ${result.length}`,
        );
      } else if (result.length < 1) {
        return [];
      }
      return result;
    } catch (err) {
      this.logger.error(`Error while getting service call '${id}': ${err}`);
      return [];
    }
  }

  public async updateServiceCall(data: ServiceCall): Promise<boolean> {
    try {
      const sql = `
          UPDATE
            service_call
          SET
            title = ?,
            description = ?,
            updated_at = ?,
            total_value = ?,
            status = ?
          WHERE
           id = ?
        `;
      await this.dbConnection.query(sql, [
        data.title,
        data.description,
        data.updated_at,
        data.total_value,
        data.status,
        data.id,
      ]);
      return true;
    } catch (err) {
      this.logger.error(
        `Error while updating service call '${data.id}': ${err}`,
      );
      return false;
    }
  }

  public async deleteServiceCall(id: number): Promise<boolean> {
    try {
      const sql = `
          DELETE FROM
            service_call
          WHERE
            id = ?
        `;
      await this.dbConnection.query(sql, [id]);
      return true;
    } catch (err) {
      this.logger.error(`Error while deleting call '${id}': ${err}`);
      return false;
    }
  }
}
