import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';;
import { RouterNavigation } from 'src/app/helpers/router.navigation';
import { User } from 'src/app/interfaces/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  public korisnik = {};

  public pracenjeStatus: string;

  public alas: string;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private routerNavigation: RouterNavigation) {
  }

  ngOnInit() {
    this.pretplate.push(
      this.activatedRoute.paramMap.subscribe((parametri) => {
        this.alas = parametri.get('alas');

        this.dohvatiKorisnika(this.alas);
        
      }, (greska) => {
        console.log(greska);
      })
    )
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  promeniStatusPracenja() {

    if(this.pracenjeStatus === 'korisnikovProfil') {
      this.routerNavigation.idiNaPodesavanja();
      return;
    }

    this.pracenjeStatus = 'obradaTrenutno';
    this.pretplate.push(
      this.userService.promeniStatusPracenja(this.alas).subscribe((korisnik) => {
        this.userService.korisnikPodaci = korisnik;
        this.proveriStatusPracenja();
      }, (greska) => {
        console.log(greska);
        this.modalNaslov = 'Грешка при промени статуса праћења';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
        this.proveriStatusPracenja();
      })
    )
  }

  dohvatiKorisnika(alas: string) {
    this.pretplate.push(
      this.userService.dohvatiKorisnika(alas).subscribe((korisnik) => {
        this.korisnik = korisnik;
        this.proveriStatusPracenja();
      }, (greska) => {
        console.log(greska);
        this.modalNaslov = 'Грешка при дохваћању корисника';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
      })
    );
  }

  proveriStatusPracenja() {
    if (this.alas === this.userService.korisnikPodaci.alas) {
      this.pracenjeStatus = 'korisnikovProfil';
    } else {
      if(this.userService.korisnikPodaci.following.includes(this.korisnik['_id'])){
        this.pracenjeStatus = 'otprati';
      } else {
        this.pracenjeStatus = 'zaprati';
      }
    }
  }

}
