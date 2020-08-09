import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
              private router: Router) { }

  intercept(zahtev: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Presretanje svakog zahteva obradom gresaka
    return next.handle(zahtev).pipe(catchError(err => {
      // Neautorizovan zahtev trazi osvezenje
      if (err.status === 401) {
          this.auth.odjaviSe();
          this.router.navigateByUrl('/');
      }

      // Propagacija greske
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

}
