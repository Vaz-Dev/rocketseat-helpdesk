import { Blob } from 'node:buffer';

export class AdminDto {
  name: string;
  user_id?: string;
  admin_id?: string;
  email: string;
  password: string;
  pfp?: Blob;
}
