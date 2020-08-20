import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable, EMPTY } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Izmena } from '../interfaces/izmena.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static readonly userLink = 'http://localhost:3000/user';
  private static readonly activeLink = 'http://localhost:3000/active';

  private korisnik: User;
  private sviKorisnici: User[];
  private aktivniKorisnici: User[];

  constructor(private http: HttpClient) {}

  public azurirajKorisnika(forma: FormData): Observable<User> {
    // Uzimanje samo vrednosti koje nisu iste
    const izmene: Izmena = {};
    for (const form in forma) {
      if (forma[form] !== this.korisnik[form]) {
        izmene[form] = forma[form];
      }
    }
    return !Object.keys(izmene).length ? EMPTY :
      this.http.patch<User>(UserService.userLink, izmene).pipe(shareReplay());
  }

  public obrisiKorisnika(): Observable<User> {
    return this.http.delete<User>(UserService.userLink).pipe(shareReplay());
  }

  public dohvatiSveKorisnike(): Observable<User[]> {
    return this.http.get<User[]>(UserService.userLink).pipe(shareReplay());
  }

  public dohvatiAktivneKorisnike(): Observable<User[]> {
    return this.http.get<User[]>(UserService.activeLink).pipe(shareReplay());
  }

  public dohvatiKorisnika(alas): Observable<User> {
    return this.http.get<User>(UserService.userLink + '/' + alas).pipe(shareReplay());
  }

  public promeniStatusPracenja(alas): Observable<User> {
    return this.http.post<User>(UserService.userLink + '/' + alas, {}).pipe(shareReplay());
  }

  public get korisnikPodaci() {
    return this.korisnik;
  }

  public set korisnikPodaci(podaci) {
    this.korisnik = podaci;
  }

  public get sviKorisniciPodaci() {
    return this.sviKorisnici;
  }

  public set sviKorisniciPodaci(sviKorisnici) {
    this.sviKorisnici = sviKorisnici;
  }

  public get aktivniKorisniciPodaci() {
    return this.aktivniKorisnici;
  }

  public set aktivniKorisniciPodaci(aktivniKorisnici) {
    this.aktivniKorisnici = aktivniKorisnici;
  }

}
