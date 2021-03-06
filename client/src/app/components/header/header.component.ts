import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../data.services/auth.service';
import { get } from 'scriptjs';

import { Subscription } from 'rxjs';
import { UserService } from '../../data.services/user.service';
import { RouterNavigation } from '../../helper.services/router.navigation';
import { EscRegExp } from '../../helper.services/esc-reg-exp';
import { User } from 'src/app/interfaces/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('settings', { static: false })
  private podesavanja: ElementRef;

  @ViewChild('search', { static: false })
  private pretraga: ElementRef;

  private pretplate: Subscription[] = [];

  public prikaziMeni = false;
  public prikaziPretragu = false;
  public prikaziPraznuPretragu = false;

  public pretrazeniKorisnici: User[] = [];


  constructor(private auth: AuthService,
              private renderer: Renderer2,
              public routerNavigation: RouterNavigation,
              private userService: UserService) {
    // Provera klikova van menija sa podesavanjima
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.podesavanja.nativeElement.contains(e.target)) {
          this.prikaziMeni = false;
      }

      if (!this.pretraga.nativeElement.contains(e.target)) {
        this.prikaziPretragu = false;
    }
   });
  }

  ngOnInit() {
    get('https://kit.fontawesome.com/c059048980.js', () => {
        // FontAwesome library has been loaded...
    });
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  odjaviSe() {
    this.pretplate.push(
      this.auth.odjaviSe().subscribe(() => {
        this.routerNavigation.idiNaPocetnuStranu();
      })
    );
  }

  menjajPadajuciMeni() {
    this.prikaziMeni = !this.prikaziMeni;
  }

  dohvatiSveKorisnike() {
    this.prikaziPretragu = true;
    this.pretplate.push(
      this.userService.dohvatiSveKorisnike().subscribe((sviKorisnici) => {
        this.userService.sviKorisniciPodaci = sviKorisnici;
      }, () => {
        this.userService.sviKorisniciPodaci = [];
      })
    );
  }

  pretraziKorisnike(event) {
    if (event.target.value) {
      const reg = new EscRegExp(event.target.value, 'i');
      this.pretrazeniKorisnici = this.userService.sviKorisniciPodaci.filter(
        korisnik => korisnik.alas.match(reg) || korisnik.display && korisnik.display.match(reg)
      );

      if (this.pretrazeniKorisnici.length) {
        this.prikaziPretragu = true;
        this.prikaziPraznuPretragu = false;
      } else {
        this.prikaziPraznuPretragu = true;
      }

    } else {
      this.prikaziPretragu = false;
    }
  }

}
