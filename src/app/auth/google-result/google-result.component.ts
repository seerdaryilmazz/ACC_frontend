import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services';

@Component({
    selector: 'google-result',
    templateUrl: './google-result.component.html',
})
export class GoogleResultComponent implements OnInit {
    public showMessage = false;
    constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {

    }

    ngOnInit(): void {
        const token: string = this.route.snapshot.queryParamMap.get('t');
        const email: string = this.route.snapshot.queryParamMap.get('e');
        localStorage.setItem('LoggedUserEmail', email);
        if (!token) {
            return this.router.navigate['auth/login'];
        }
        setTimeout(() => {
            this.userService.validateGoogleResult(token).subscribe(data => {
                localStorage.setItem('auth_app_token', JSON.stringify({
                    createdAt: new Date(),
                    name: 'nb:auth:jwt:token', ownerStrategyName: 'email', value: data['payload']['access_token'],
                }));
                this.showMessage = true;
                setTimeout(() => {
                    this.router.navigate(['pages/dashboard']);
                }, 1000);
            });
        }, 1000);
    }
}
