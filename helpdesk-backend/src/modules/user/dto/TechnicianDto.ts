import { Blob } from 'node:buffer';

export class TechnicianDto {
  name: string;
  user_id?: string;
  admin_id?: string;
  email: string;
  password: string;
  pfp?: Blob;
  working_hours: string;
}
