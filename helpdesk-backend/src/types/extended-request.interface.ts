import { Request } from 'express';
import { User } from 'src/database/dao/interface';

export interface ExtendedRequest extends Request {
  auth?: any;
  user?: User;
}
