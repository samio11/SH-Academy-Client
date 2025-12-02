export interface IUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export enum ERole {
  admin = "admin",
  student = "student",
}
