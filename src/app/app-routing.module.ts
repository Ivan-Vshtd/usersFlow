import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './list-user/user.component';
import {AddUserComponent} from './add-user/add-user.component';
import {LoginComponent} from './login/login.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {AuthGuard} from "./helper/auth.guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'list-user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'edit-user', component: EditUserComponent, canActivate: [AuthGuard]},
  {path: '**', component: LoginComponent},
];

export const  routing = RouterModule.forRoot(routes);
