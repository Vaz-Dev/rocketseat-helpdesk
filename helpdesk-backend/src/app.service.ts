import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  listRoutes() {
    // TODO
    return JSON.stringify({
      title: 'List of all routes',
      auth: {},
      user: {},
      service: { type: {}, call: {} },
    });
  }
}
