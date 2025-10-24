import { CallCosts } from './call_costs.interface';
import { ServiceType } from './service_type.interface';

export interface ServiceCall {
  id?: number;
  service: number | ServiceType;
  client: string;
  technician: string;
  title: string;
  description?: string;
  total_value: number;
  additional_costs?: CallCosts[];
  status?: 'open' | 'in_progress' | 'closed';
  created_at?: string;
  updated_at?: string;
}
