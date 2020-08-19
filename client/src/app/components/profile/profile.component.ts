import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  public korisnik: User;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.pretplate.push(
      this.activatedRoute.paramMap.subscribe((parametri) => {
        const alas = parametri.get('alas');
        this.dohvatiKorisnika(alas);
      }, (greska) => {
        console.log(greska);
      })
    );
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  dohvatiKorisnika(alas: string) {
    this.pretplate.push(
      this.userService.dohvatiKorisnika(alas).subscribe((korisnik) => {
        this.korisnik = korisnik;
      }, (greska) => {
        console.log(greska);
      })
    );
  }

}
