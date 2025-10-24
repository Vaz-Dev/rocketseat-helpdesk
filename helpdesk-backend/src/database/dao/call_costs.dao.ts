import { Inject, Injectable, Logger } from '@nestjs/common';
import { DBConnection } from '../database.service';
import { CallCosts } from './interface';

@Injectable()
export class CallCostsDAO {
  private readonly logger = new Logger(CallCostsDAO.name);

  constructor(
    @Inject('DBConnection') private readonly dbConnection: DBConnection,
  ) {}

  public async addCallCosts(data: CallCosts): Promise<boolean> {
    try {
      const sql = `
          INSERT INTO
            call_costs
              (name, value, service_call)
            VALUES
              (?, ?, ?)
        `;
      await this.dbConnection.query(sql, [
        data.name,
        data.value,
        data.service_call,
      ]);
      return true;
    } catch (err) {
      this.logger.error(
        `Failed to add service call aditional cost '${data.name}': ${err}`,
      );
      return false;
    }
  }

  public async getCallCostsByCallId(id: number): Promise<CallCosts[]> {
    try {
      const sql = `
          SELECT
            id, value, name
          FROM
            call_costs
          WHERE
            service_call = ?
        `;
      return await this.dbConnection.query(sql, [id]);
    } catch (err) {
      this.logger.error(
        `Failed to get call costs from service '${id}': ${err}`,
      );
      return [];
    }
  }

  public async getCallCostById(id: number): Promise<CallCosts[]> {
    try {
      const sql = `
          SELECT
            value
          FROM
            call_costs
          WHERE
            id = ?
        `;
      return await this.dbConnection.query(sql, [id]);
    } catch (err) {
      this.logger.error(`Failed to get call cost with id '${id}': ${err}`);
      return [];
    }
  }

  public async deleteCallCosts(id: number): Promise<boolean> {
    try {
      const sql = `
          DELETE FROM
            call_costs
          WHERE
            id = ?
        `;
      await this.dbConnection.query(sql, [id]);
      return true;
    } catch (err) {
      this.logger.error(`Failed to delete call cost with id '${id}': ${err}`);
      return false;
    }
  }
}
