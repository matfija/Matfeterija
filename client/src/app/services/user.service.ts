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

  private korisnik: User;

  constructor(private http: HttpClient) {}

  public azurirajKorisnika(forma: FormData): Observable<User> {
    // Uzimanje samo vrednosti koje nisu iste
    const izmene: Izmena = {};
    for (const form in forma) {
      if (form === 'oldPassword' || form === 'newPassword' ||
        forma[form] && forma[form] !== this.korisnik[form]) {
        izmene[form] = forma[form];
      }
    }
    return !Object.keys(izmene).length ? EMPTY :
      this.http.patch<User>(UserService.userLink, izmene).pipe(shareReplay());
  }

  public get korisnikPodaci() {
    return this.korisnik;
  }

  public set korisnikPodaci(podaci) {
    this.korisnik = podaci;
  }

}
