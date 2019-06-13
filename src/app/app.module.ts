import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {UserComponent} from './list-user/user.component';
import {AddUserComponent} from './add-user/add-user.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from './service/user.service';
import {LoginComponent} from './login/login.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {routing} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CustomMaterialModule} from './material/material.module';
import {AuthenticationService} from "./service/authentication.service";
import {JwtInterceptor} from "./helper/jwt.interceptor";
import {ErrorInterceptor} from "./helper/error.incerteptor";
import {SharedService} from "./service/shared.service";

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AddUserComponent,
    LoginComponent,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
  ],
  providers: [UserService, AuthenticationService, SharedService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
  }
}

