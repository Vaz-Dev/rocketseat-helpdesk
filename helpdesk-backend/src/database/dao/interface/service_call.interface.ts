import { CallCosts } from './call_costs.interface';
import { ServiceType } from './service_type.interface';
import { User } from './user.interface';

export interface ServiceCall {
  id?: number;
  service: number;
  client: string;
  technician: string;
  title: string;
  description?: string;
  total_value: number;
  status?: 'open' | 'in_progress' | 'closed';
  created_at?: string;
  updated_at?: string;
}
