export interface User {
  id: string;
  email: string;
  createdAt: Date;
  timeZone?: string;
  mood?: string;
  isActive: boolean;
}
