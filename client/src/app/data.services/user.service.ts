import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable, EMPTY, Subscription } from 'rxjs';
import { Izmena } from '../interfaces/izmena.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static readonly userLink = 'http://localhost:3000/user/';
  private static readonly activeLink = 'http://localhost:3000/active/';

  private korisnik: User;
  private sviKorisnici: User[] = [];
  private aktivniKorisnici: User[] = [];

  constructor(private http: HttpClient,
              private authService: AuthService) {
    // HTTP je protokol bez stanja, tako da je neophodno
    // rucno osveziti svaki dohvaceni entitet; ovde se
    // na svaki minut osvezavaju aktivni korisnici
    setInterval(() => {
      if (this.authService.prijavljen) {
        this.osveziAktivne();
      }
    }, 60000);
  }

  public azurirajKorisnika(forma: FormData): Observable<User> {
    // Uzimanje samo vrednosti koje nisu iste
    const izmene: Izmena = {};
    for (const form in forma) {
      if (forma[form] !== this.korisnik[form]) {
        izmene[form] = forma[form];
      }
    }
    return !Object.keys(izmene).length ? EMPTY :
      this.http.patch<User>(UserService.userLink, izmene);
  }

  public obrisiKorisnika(): Observable<User> {
    return this.http.delete<User>(UserService.userLink);
  }

  public dohvatiSveKorisnike(): Observable<User[]> {
    return this.http.get<User[]>(UserService.userLink);
  }

  public dohvatiAktivneKorisnike(): Observable<User[]> {
    return this.http.get<User[]>(UserService.activeLink);
  }

  public dohvatiKorisnika(alas): Observable<User> {
    return this.http.get<User>(UserService.userLink + alas);
  }

  public promeniStatusPracenja(alas): Observable<User> {
    return this.http.post<User>(UserService.userLink + alas, {});
  }

  public osveziAktivne(): void {
    let pretplata: Subscription;
    new Promise((resolve, reject) => {
      pretplata = this.dohvatiAktivneKorisnike().subscribe((aktivniKorisnici) => {
        resolve(aktivniKorisnici);
      }, (greska) => {
        reject(greska);
      });
    }).then((aktivniKorisnici: User[]) => {
      this.aktivniKorisnici = aktivniKorisnici;
    }).catch(() => {
    }).finally(() => {
      pretplata.unsubscribe();
    });
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

}
