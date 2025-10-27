import { CallCosts, ServiceType, User } from 'src/database/dao/interface';

export class ExtendedCallDto {
  id: number;
  service: ServiceType;
  client: User;
  technician: User;
  title: string;
  description: string;
  total_value: number;
  additional_costs: CallCosts[];
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
}
