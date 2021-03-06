export interface User {
  name: string;
  role: Roles;
  userId: string;
  image: string;
  favBooks?: string;
  bookcount?: number;
  socialIds?: string;
  friends?: string;
}

export interface Roles {
  subscriber?: boolean;
  admin?: boolean;
}
