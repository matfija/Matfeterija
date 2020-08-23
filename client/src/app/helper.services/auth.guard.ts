import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../data.services/auth.service';
import { RouterNavigation } from './router.navigation';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private routerNavigation: RouterNavigation,
        private auth: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.auth.prijavljen) {
            return true;
        }

        // Ako nije logovan vraca na pocetnu stranu
        this.routerNavigation.idiNaPocetnuStranu();
        return false;
    }
}
