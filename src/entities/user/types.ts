export type AccountType = 'freelancer' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  thirdName?: string | null;
  permissions: string[];
  accountType: AccountType;
  hasCompanyMembership: boolean;
  createdAt: string;
  updatedAt: string;
}
