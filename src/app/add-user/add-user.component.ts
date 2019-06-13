import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      id: [],
      username: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.userService
      .createUser(this.addForm.value)
      .subscribe(data => {
        this.router.navigate(['/login']);
      });
  }
}
