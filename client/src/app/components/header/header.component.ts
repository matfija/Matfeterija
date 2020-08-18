import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { get } from 'scriptjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

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

  public pretrazeniKorisnici = [];


  constructor(private auth: AuthService,
              private renderer: Renderer2,
              private router: Router,
              private userService: UserService) {
                // Check for click outside settings menu
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
      this.auth.odjaviSe().subscribe()
    );
    this.router.navigate(['/']);
  }

  menjajPadajuciMeni() {
    this.prikaziMeni = !this.prikaziMeni;
  }

  idiNaPodesavanja() {
    this.router.navigate(['/podesavanja']);
  }

  dohvatiSveKorisnike() {
    this.prikaziPretragu = true;
    this.pretplate.push(
      this.userService.dohvatiSveKorisnike().subscribe((sviKorisnici) => {
        this.userService.sviKorisniciPodaci = sviKorisnici;
      }, (greska) => {
        console.log(greska);
        this.userService.sviKorisniciPodaci = [];
      })
    );
  }

  pretraziKorisnike(event) {
    if (event.target.value) {
      const reg = new RegExp(event.target.value, 'i');
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

  idiNaProfil(alas: any) {
    this.router.navigate(['/profil', { alas }]);
  }

  idiNaPocetnuStranu() {
    this.router.navigate(['/']);
  }
}
