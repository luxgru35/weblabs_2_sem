// types/user.ts
export interface User {
    id: string;
    name: string;
    email?: string;
    role?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: 'male' | 'female';
    birthDate: string;
  }