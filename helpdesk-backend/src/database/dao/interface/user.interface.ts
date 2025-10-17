import { Blob } from 'buffer';

export interface User {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
  pfp?: Blob;
  role?: 'admin' | 'client' | 'technician';
  role_id?: string;
  working_hours?: string;
}
