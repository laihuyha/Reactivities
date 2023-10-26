export interface User {
  id: number;
  username: string;
  displayName: string;
  token: string;
  image?: string;
}

export interface UserFormValues {
  email: string;
  displayName: string;
  username: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
  remember: boolean;
}
