import {Component, OnInit} from '@angular/core';
import {User} from '../models/user.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {first} from 'rxjs/operators';
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userName: String;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    let userId = localStorage.getItem('editUserId');

    if (!userId) {
      alert('Invalid action!');
      this.router.navigate(['list-user']);
      return;
    }
    this.editForm = this.formBuilder.group({
      id: [],
      username: [],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.userService
      .getUserById(userId)
      .subscribe(data => {
        this.userName = data.username;
        data.password = "*****";
        this.editForm.setValue(data);
      });
  }

  onSubmit() {
   if(this.isAdmin()){
     this.userService
         .updateEachUser(this.editForm.value)
         .pipe(first())
         .subscribe(data => {
               this.router
                   .navigate(['list-user']);
             },
             error => {
               alert(error);
             });
   } else{
     this.userService
         .updateUser(this.editForm.value)
         .pipe(first())
         .subscribe(data => {
               this.router
                   .navigate(['list-user']);
             },
             error => {
               alert(error);
             });
   }

  }

  isAdmin(): boolean {
    let user = new User();
    user = this.authenticationService.currentUserValue;
    return user.roles.includes('ROLE_ADMIN')
  }

}
