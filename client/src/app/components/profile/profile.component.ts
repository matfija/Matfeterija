import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../data.services/user.service';
import { RouterNavigation } from '../../helper.services/router.navigation';
import { User } from '../../interfaces/user.model';
import { PostService } from '../../data.services/post.service';
import { OptionsService } from '../../data.services/options.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  public korisnik: User = {
    _id: null,
    alas: null,
    password: null,
    followers: [],
    following: []
  };

  public pracenjeStatus: string;

  public alas: string;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  public brojObjava: number;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private routerNavigation: RouterNavigation,
              public postService: PostService,
              private optionsService: OptionsService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((parametri) => {
      this.alas = parametri.get('alas');
      this.optionsService.user = this.alas;
      this.postService.osveziObjave();
      this.dohvatiKorisnika(this.alas);
    });
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  promeniStatusPracenja() {

    if (this.pracenjeStatus === 'korisnikovProfil') {
      this.routerNavigation.idiNaPodesavanja();
      return;
    }

    this.pracenjeStatus = 'obradaTrenutno';
    this.pretplate.push(
      this.userService.promeniStatusPracenja(this.alas).subscribe((korisnik) => {
        this.userService.korisnikPodaci = korisnik;
        this.dohvatiKorisnika(this.alas);
        this.proveriStatusPracenja();
      }, () => {
        this.modalNaslov = 'Грешка при промени статуса праћења';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
        this.proveriStatusPracenja();
      })
    );
  }

  dohvatiKorisnika(alas: string) {
    this.pretplate.push(
      this.userService.dohvatiKorisnika(alas).subscribe((korisnik) => {
        this.korisnik = korisnik;
        this.proveriStatusPracenja();
        this.brojObjava = this.postService.sveObjavePodaci.filter((o: any) => o.user._id === korisnik._id).length;
      }, () => {
        this.modalNaslov = 'Грешка при дохватању корисника';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
      })
    );
  }

  proveriStatusPracenja() {
    if (this.alas === this.userService.korisnikPodaci.alas) {
      this.pracenjeStatus = 'korisnikovProfil';
    } else if (!this.instanceOfUser(this.userService.korisnikPodaci.following)) {
      if (this.userService.korisnikPodaci.following.includes(this.korisnik._id)) {
        this.pracenjeStatus = 'otprati';
      } else {
        this.pracenjeStatus = 'zaprati';
      }
    }
  }

  private instanceOfUser(object: any): object is User[] {
    return object[0] && object[0]._id;
  }

}
