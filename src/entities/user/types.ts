export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  thirdName?: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}
