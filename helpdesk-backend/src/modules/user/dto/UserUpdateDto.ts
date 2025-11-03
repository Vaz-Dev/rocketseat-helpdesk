import { Blob } from 'node:buffer';

export class UserUpdateDto {
  id?: string;
  name?: string;
  password?: string;
  pfp?: Blob;
  working_hours?: string;
  last_logout?: number;
}
