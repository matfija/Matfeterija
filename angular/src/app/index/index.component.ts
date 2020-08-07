import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public prijavaFormular: FormGroup;
  public registracijaFormular: FormGroup;
  public potvrdaFormular: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.prijavaFormular = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/(a[fi]|m[lmrnvai])([0-1][0-9])[0-9]{3}/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registracijaFormular = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/(a[fi]|m[lmrnvai])([0-1][0-9])[0-9]{3}/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.potvrdaFormular = this.formBuilder.group({
      authcode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  ngOnInit() {
  }

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

  public prijaviSe(prijava: FormData): void {
    console.log(prijava);

    if (!this.prijavaFormular.valid) {
      let poruka = 'Формулар није исправан!';
      poruka += this.dohvatiGreske(this.pUser, this.pPass);
      window.alert(poruka);
      return;
    }

    // Komunikacija sa serverom

    this.prijavaFormular.reset();
  }

  public registrujSe(registracija: FormData): void {
    console.log(registracija);

    if (!this.registracijaFormular.valid) {
      let poruka = 'Формулар није исправан!';
      poruka += this.dohvatiGreske(this.rUser, this.rPass);
      window.alert(poruka);
      return;
    }

    // Komunikacija sa serverom

    this.registracijaFormular.reset();
  }

  public potvrdiSe(potvrda: FormData): void {
    console.log(potvrda);

    if (!this.potvrdaFormular.valid) {
      window.alert('Формулар није исправан. Потврдни код мора бити дужине тачно 8 (осам) карактера.');
      return;
    }

    // Komunikacija sa serverom

    this.potvrdaFormular.reset();
  }

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
