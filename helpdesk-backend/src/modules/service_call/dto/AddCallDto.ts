export class addServiceCallDto {
  service: number;
  client?: string; // Client does NOT need to send its id, the controller gets it from req.user.role_id
  technician: string;
  title: string;
  description: string;
}
