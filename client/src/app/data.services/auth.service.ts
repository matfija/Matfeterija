import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly loginLink = 'http://localhost:3000/login/';
  private static readonly activeLink = 'http://localhost:3000/active/';

  private tekucaSesija = false;

  constructor(private http: HttpClient) {}

  public registrujSe(registracija: FormData): Observable<User> {
    return this.http.post<User>(AuthService.loginLink, registracija);
  }

  public prijaviSe(prijava: FormData): Observable<User> {
    return this.http.put<User>(AuthService.loginLink, prijava);
  }

  public potvrdiSe(potvrda: FormData): Observable<User> {
    return this.http.patch<User>(AuthService.loginLink, potvrda);
  }

  public uspesnaPrijava() {
    this.tekucaSesija = true;
  }

  public odjaviSe(): Observable<User> {
    this.tekucaSesija = false;
    return this.http.delete<User>(AuthService.activeLink);
  }

  public get prijavljen() {
    return this.tekucaSesija;
  }
}
