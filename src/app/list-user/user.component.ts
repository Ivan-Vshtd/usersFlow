import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../models/user.model';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {AuthenticationService} from "../service/authentication.service";
import {MatPaginator} from "@angular/material";


@Component({
  selector: 'app-list-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit{

  users: User [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'edit', 'delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions: number[] = [3, 5, 10, 20];
  length;

  constructor(private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userService
        .getAllUsers()
        .subscribe(data => {
          this.length = data.length;
        });
    this.collect();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(
        (event) => {
          this.pageIndex = event.pageIndex;
          this.pageSize = event.pageSize;
          this.collect();
        }
    );
  }

  collect(){
    this.userService
        .getUsers(this.pageIndex, this.pageSize)
        .subscribe(data => {
          this.users = data;
        });
  }

  deleteUser(user: User): void {
    this.userService
      .deleteUser(user.id)
      .subscribe(data => {
        this.users = this.users.filter(requiredUser => requiredUser !== user);
      });
  }

  editUser(user: User): void {
    localStorage.removeItem('editUserId');
    localStorage.setItem('editUserId', user.id);
    this.router.navigate(['edit-user']);
  }

  isAdmin(): boolean {
    let user = new User();
    user = this.authenticationService.currentUserValue;
    return user.roles.includes('ROLE_ADMIN')
  }

}
