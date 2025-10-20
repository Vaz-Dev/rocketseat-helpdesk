import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  listRoutes() {
    return JSON.stringify({ title: 'List of all routes', auth: [], user: [] });
  }
}
