import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static readonly userLink = 'http://localhost:3000/user';

  private korisnik: User = null;

  constructor(private http: HttpClient) {}

  public azurirajKorisnika(forma: FormData): Observable<User> {
    return this.http.patch<User>(UserService.userLink, forma).pipe(shareReplay());
  }

  public get korisnikPodaci() {
    return this.korisnik;
  }

  public set korisnikPodaci(podaci) {
    this.korisnik = podaci;
  }

}
