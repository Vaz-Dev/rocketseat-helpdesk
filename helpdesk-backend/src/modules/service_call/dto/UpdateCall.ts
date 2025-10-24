export class UpdateCallDto {
  title?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'closed';
  id?: number;
}
