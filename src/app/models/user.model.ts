export class User {
  id;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token?: string;
  roles: string[];
}
