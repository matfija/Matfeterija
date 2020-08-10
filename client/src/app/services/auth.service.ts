import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly userLink = 'http://localhost:3000/login';

  private tekucaSesija = false;

  constructor(private http: HttpClient) {}

  public registrujSe(registracija: FormData): Observable<User> {
    return this.http.post<User>(AuthService.userLink, registracija).pipe(shareReplay());
  }

  public prijaviSe(prijava: FormData): Observable<User> {
    return this.http.put<User>(AuthService.userLink, prijava).pipe(shareReplay());
  }

  public potvrdiSe(potvrda: FormData): Observable<User> {
    return this.http.patch<User>(AuthService.userLink, potvrda).pipe(shareReplay());
  }

  public uspesnaPrijava() {
    this.tekucaSesija = true;
  }

  public odjaviSe() {
    this.tekucaSesija = false;
  }

  public get prijavljen() {
    return this.tekucaSesija;
  }
}