import { Blob } from 'buffer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  pfp?: Blob;
}
