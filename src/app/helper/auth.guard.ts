import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

    constructor(private router: Router, private authenticationService: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.authenticationService.currentUserValue){
            return true;
        }

        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}
