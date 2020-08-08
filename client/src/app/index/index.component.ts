import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public static init = false;

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

  public prijavaFormular: FormGroup;
  public registracijaFormular: FormGroup;
  public potvrdaFormular: FormGroup;
  public errPoruka: string;

  constructor(private formBuilder: FormBuilder, private renderer: Renderer2) {
    // Fade-in efekat po ucitavanju prozora
    window.onload = () => {
      this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '1');
    };

    // Pravljenje formulara za prijavu
    const provere = {
      username: ['', [Validators.required, Validators.pattern(/^(a[fi]|m[lmrnvai])([0-1][0-9])1?[0-9]{3}$/)]],
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
    // Pamcenje podatka o inicijalizaciji pocetne stranice
    if (!IndexComponent.init) {
      this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '0');
      IndexComponent.init = true;
    }
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

    const userErr = uKontrola.errors;
    if (userErr) {
      if (userErr.required) {
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
    console.log(prijava);

    if (!this.prijavaFormular.valid) {
      this.errPoruka = 'Формулар није исправан!';
      this.errPoruka += this.dohvatiGreske(this.pUser, this.pPass);
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom

    this.prijavaFormular.reset();
  }

  // Reakcija na registraciju
  public registrujSe(registracija: FormData): void {
    console.log(registracija);

    if (!this.registracijaFormular.valid) {
      this.errPoruka = 'Формулар није исправан!';
      this.errPoruka += this.dohvatiGreske(this.rUser, this.rPass);
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom

    this.registracijaFormular.reset();
  }

  // Reakcija na potvrdu
  public potvrdiSe(potvrda: FormData): void {
    console.log(potvrda);

    if (!this.potvrdaFormular.valid) {
      this.errPoruka = 'Формулар није исправан. Потврдни код мора бити дужине тачно 8 (осам) карактера.';
      this.modalDugme.nativeElement.click();
      return;
    }

    // Komunikacija sa serverom

    this.potvrdaFormular.reset();
  }

  // Dohvatanje polja formulara
  public get pUser() {
    return this.prijavaFormular.get('username');
  }

  public get pPass() {
    return this.prijavaFormular.get('password');
  }

  public get rUser() {
    return this.registracijaFormular.get('username');
  }

  public get rPass() {
    return this.registracijaFormular.get('password');
  }

}
