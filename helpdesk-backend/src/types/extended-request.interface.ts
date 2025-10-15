import { Request } from 'express';

export interface ExtendedRequest extends Request {
  auth?: any;
  user?: any;
}
