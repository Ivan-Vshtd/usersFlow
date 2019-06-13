import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "./service/authentication.service";
import {User} from "./models/user.model";
import {SharedService} from "./service/shared.service";
import {addHandler, connect, sendMessage} from "./util/ws.js";
import {Wsuser} from "./models/wsuser.model";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentInit {
    user: User;
    wsuser: Wsuser;
    action: string;

    constructor(private router: Router,
                private authenticationService: AuthenticationService,
                private sharedService: SharedService) {
        connect();
    }

    ngOnInit(): void {
        this.sharedService.subject.subscribe(value => {
            this.action = value;
        });
    }

    ngAfterContentInit(): void {
        this.wsHandling();
    }

    wsHandling(): void {
        addHandler(data => {
            if (data.objectType === 'USER') {
                switch (data.eventType) {
                    case 'CREATE':
                        this.sharedService.subject.next(data.body.username + ' joined');
                        break;
                    case 'LOG_IN':
                        this.sharedService.subject.next(data.body.username + ' logged in');
                        break;
                    case 'LOG_OUT':
                        this.sharedService.subject.next(data.body.username + ' logged out');
                        break;
                    case 'UPDATE':
                        this.sharedService.subject.next(data.body.username + ' was updated');
                        break;
                    case 'REMOVE':
                        this.sharedService.subject.next(data.body.username + ' was removed');
                        break;
                    default:
                        console.error(`Looks like the event type is unknown "${data.eventType}"`);
                }
            } else {
                console.error(`Looks like the object type is unknown "${data.objectType}"`);
            }
        });
    }

    users(): void {
        this.router.navigate(['list-user']);
    }

    logOut(): void {
        sendMessage(this.getWsUser());
        this.sharedService.subject.next(this.user.username + ' logged out');
        this.authenticationService.logout();
        this.router.navigate(['login']);
    }

    crntUser(): string {
        if (this.authenticationService.currentUserValue!= null) {
            this.user = JSON.parse(localStorage.getItem('currentUser'));
            return this.user.username;
        }
        return "";
    }

    getWsUser() {
        this.wsuser = new Wsuser();

        let user = new User();
        user.username = this.user.username;

        this.wsuser.body = user;
        this.wsuser.eventType = 'LOG_OUT';
        this.wsuser.objectType = 'USER';
        return this.wsuser;
    }

    editUser(): void {
        if (this.authenticationService.currentUserValue!= null) {
            let user = new User();
            user = JSON.parse(localStorage.getItem('currentUser'));
            localStorage.removeItem('editUserId');
            localStorage.setItem('editUserId', user.id);
            this.router.navigate(['edit-user']);
        }
    }

}
