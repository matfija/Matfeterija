import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(zahtev: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Provera rute zahteva
    const user = zahtev.url.includes('/user');
    const post = zahtev.url.includes('/post');
    const comm = zahtev.url.includes('/comm');

    // Dopuna zahteva dodavanjem kredencijala
    return user || post || comm ?
      next.handle(zahtev.clone({
        withCredentials: true
      })) : next.handle(zahtev);
  }

}
