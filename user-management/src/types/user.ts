export interface TUser {
  id: string;
  name: string;
  balance: number;
  email: string;
  registerAt: Date;
  active: boolean;
}

export interface TUserServer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  age: number;
}

export interface TUserApiResponse {
  users: TUserServer[];
  total: number;
  skip: number;
  limit: number;
}
