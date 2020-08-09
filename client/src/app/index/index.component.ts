import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {

  @ViewChild('container', { static: true })
  private kontejner: ElementRef;
  @ViewChild('modalb', { static: false })
  private modalDugme: ElementRef;
  @ViewChild('span1', { static: false })
  private prijavaTekst: ElementRef;
  @ViewChild('span2', { static: false })
  private registracijaTekst: ElementRef;
  @ViewChild('card3', { static: false })
  private rotaKartica: ElementRef;

  private pretplate: Subscription[] = [];

  public prijavaFormular: FormGroup;
  public registracijaFormular: FormGroup;
  public potvrdaFormular: FormGroup;
  public errPoruka: string;

  constructor(private formBuilder: FormBuilder,
              private renderer: Renderer2,
              private auth: AuthService) {
    // Pravljenje formulara za prijavu
    const provere = {
      alas: ['', [Validators.required, Validators.pattern(/^(a[fi]|m[lmrnvai])([0-1][0-9])1?[0-9]{3}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    };
    this.prijavaFormular = this.formBuilder.group(provere);
    this.registracijaFormular = this.formBuilder.group(provere);

    // Pravljenje formulara za potvrdu
    this.potvrdaFormular = this.formBuilder.group({
      authcode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  ngOnInit() {
    // Sakrivanje kontejnera ako stranica nije ucitana
    if (document.readyState !== 'complete') {
      this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '0');

      // Fade-in efekat po ucitavanju prozora
      window.onload = () => {
        this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '1');
      };
    }
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  public prijavaKlik(): void {
    // Promena boje dugmadi za rotaciju
    this.renderer.setStyle(this.prijavaTekst.nativeElement, 'color', 'firebrick');
    this.renderer.setStyle(this.registracijaTekst.nativeElement, 'color', '#748194');

    // Uklanjanje klase za rotaciju kartice
    this.renderer.removeClass(this.rotaKartica.nativeElement, 'rota');
  }

  public registracijaKlik(): void {
    // Promena boje dugmadi za rotaciju
    this.renderer.setStyle(this.registracijaTekst.nativeElement, 'color', 'firebrick');
    this.renderer.setStyle(this.prijavaTekst.nativeElement, 'color', '#748194');

    // Uklanjanje klase za rotaciju kartice
    this.renderer.addClass(this.rotaKartica.nativeElement, 'rota');
  }

  // Dohvatanje gresaka u formularu u tekstualnoj formi
  public dohvatiGreske(uKontrola: AbstractControl, pKontrola: AbstractControl): string {
    let poruka = '';

    const alasErr = uKontrola.errors;
    if (alasErr) {
      if (alasErr.required) {
        poruka += ' Налог на Аласу је обавезно поље формулара.';
      } else {
        poruka += ' Налог на Аласу мора да се уклопи у шаблон именовања (нпр. mi16099).';
      }
    }

    const passErr = pKontrola.errors;
    if (passErr) {
      if (passErr.required) {
        poruka += ' Лозинка је обавезно поље формулара.';
      } else {
        poruka += ' Лозинка мора бити макар дужине 8 (осам) карактера.';
      }
    }

    return poruka;
  }

  // Reakcija na prijavu
  public prijaviSe(prijava: FormData): void {
    if (!this.prijavaFormular.valid) {
      this.errPoruka = 'Формулар није исправан!';
      this.errPoruka += this.dohvatiGreske(this.pAlas, this.pPass);
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom
    this.pretplate.push(
      this.auth.prijaviSe(prijava).subscribe(() => {
        window.alert('Пријава...'); // MODAL!
        this.auth.uspesnaPrijava();
      })
    );

    this.prijavaFormular.reset();
  }

  // Reakcija na registraciju
  public registrujSe(registracija: FormData): void {
    if (!this.registracijaFormular.valid) {
      this.errPoruka = 'Формулар није исправан!';
      this.errPoruka += this.dohvatiGreske(this.rAlas, this.rPass);
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom
    this.pretplate.push(
      this.auth.registrujSe(registracija).subscribe(() => {
        window.alert('Регистрација...'); // MODAL!
      })
    );

    this.registracijaFormular.reset();
  }

  // Reakcija na potvrdu
  public potvrdiSe(potvrda: FormData): void {
    if (!this.potvrdaFormular.valid) {
      this.errPoruka = 'Формулар није исправан. Потврдни код мора бити дужине тачно 8 (осам) карактера.';
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom
    this.pretplate.push(
      this.auth.potvrdiSe(potvrda).subscribe(() => {
        window.alert('Потврда...'); // MODAL!
      })
    );

    this.potvrdaFormular.reset();
  }

  // Dohvatanje polja formulara
  public get pAlas() {
    return this.prijavaFormular.get('alas');
  }

  public get pPass() {
    return this.prijavaFormular.get('password');
  }

  public get rAlas() {
    return this.registracijaFormular.get('alas');
  }

  public get rPass() {
    return this.registracijaFormular.get('password');
  }

}
