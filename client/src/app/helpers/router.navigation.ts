import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RouterNavigation {

    constructor(private router: Router) {

    }

    idiNaProfil(alas: string) {
        this.router.navigate(['/profil', alas]);
      }
    
    idiNaPocetnuStranu() {
    this.router.navigate(['/']);
    }

    idiNaPodesavanja() {
        this.router.navigate(['/podesavanja']);
    }
}
