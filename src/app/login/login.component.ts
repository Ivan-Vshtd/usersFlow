import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({ providedIn: 'root' })
export class LoginComponent implements CanActivate, OnInit {

  loginForm: FormGroup;
  submitted = false;
  invalidLogin = false;
  returnUrl:string;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

/*    // reset login status
    this.authenticationService.logout();*/

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.invalidLogin = false;
    this.authenticationService.login(this.form.username.value, this.form.password.value)
        .pipe(first())
        .subscribe(
            data => {
              this.router.navigate(['/list-user']);
            },
            error => {
              this.error = error;
              this.invalidLogin = true;
            });
  }

  registration(){
    this.router.navigate(['/add-user']);
  }
}
