import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = 'http://localhost:8080/api/';
  private adminUrl = 'http://localhost:8080/api/admin/users/';

  constructor(private http: HttpClient) {
  }

  public getUsers(index, size) {
    return this.http
      .get<User[]>(this.baseUrl + 'users/' + index  + '/' + size);
  }

  public getAllUsers() {
    return this.http
        .get<User[]>(this.baseUrl + 'users');
  }

  public createUser(user: User) {
    return this.http
      .post<User>(this.baseUrl + 'auth/registration', user);
  }

  public updateUser(user: User) {
    return this.http
      .put<User>(this.baseUrl + 'user/' + user.id, user);
  }

  public getUserById(id) {
    return this.http
      .get<User>(this.baseUrl + 'user/' + id);
  }

  /*admin methods*/

  public deleteUser(id: string) {
    return this.http
        .delete(this.adminUrl + id);
  }

  public updateEachUser(user: User) {
    return this.http
        .put<User>(this.adminUrl + user.id, user);
  }
}
