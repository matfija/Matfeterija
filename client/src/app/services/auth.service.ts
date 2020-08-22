import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly loginLink = 'http://localhost:3000/login/';
  private static readonly activeLink = 'http://localhost:3000/active/';

  private tekucaSesija = false;

  constructor(private http: HttpClient) {}

  public registrujSe(registracija: FormData): Observable<User> {
    return this.http.post<User>(AuthService.loginLink, registracija).pipe(shareReplay());
  }

  public prijaviSe(prijava: FormData): Observable<User> {
    return this.http.put<User>(AuthService.loginLink, prijava).pipe(shareReplay());
  }

  public potvrdiSe(potvrda: FormData): Observable<User> {
    return this.http.patch<User>(AuthService.loginLink, potvrda).pipe(shareReplay());
  }

  public uspesnaPrijava() {
    this.tekucaSesija = true;
  }

  public odjaviSe(): Observable<User> {
    this.tekucaSesija = false;
    return this.http.delete<User>(AuthService.activeLink).pipe(shareReplay());
  }

  public get prijavljen() {
    return this.tekucaSesija;
  }
}
