import { Blob } from 'node:buffer';

export class ClientDto {
  name: string;
  user_id?: string;
  client_id?: string;
  email: string;
  password: string;
  pfp?: Blob;
}
