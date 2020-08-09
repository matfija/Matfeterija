import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(zahtev: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Dopuna zahteva dodavanjem kredencijala
    return next.handle(zahtev.clone({
      withCredentials: true
    }));
  }

}
