import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription} from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  public nemaAktivnihKorisnika = true;

  constructor(public userService: UserService) { }

  ngOnInit() {
    // Inicijalno dohvatanje korisnika
    this.dohvatiAktivneKorisnike();
    // Svaki minut se azuriraju aktivni korisnici
    this.pretplate.push(
      interval(60000).subscribe(() => {
        this.dohvatiAktivneKorisnike();
      })
    );
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  dohvatiAktivneKorisnike() {
    this.pretplate.push(
      this.userService.dohvatiAktivneKorisnike().subscribe((aktivniKorisnici) => {
        this.userService.aktivniKorisniciPodaci = aktivniKorisnici;
        if (aktivniKorisnici.length) {
          this.nemaAktivnihKorisnika = false;
        } else {
          this.nemaAktivnihKorisnika = true;
        }
      }, (greska) => {
        console.log(greska);
        this.userService.aktivniKorisniciPodaci = [];
        this.nemaAktivnihKorisnika = true;
      })
    );
  }
}
