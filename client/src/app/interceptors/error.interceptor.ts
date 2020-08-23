import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../data.services/auth.service';
import { RouterNavigation } from '../helper.services/router.navigation';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
              private routerNavigation: RouterNavigation) {}

  intercept(zahtev: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Presretanje svakog zahteva obradom gresaka
    return next.handle(zahtev).pipe(catchError(err => {
      // Neautorizovan zahtev trazi osvezenje
      if (err.status === 401) {
          this.auth.odjaviSe();
          this.routerNavigation.idiNaPocetnuStranu();
      }

      // Propagacija greske
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

}
