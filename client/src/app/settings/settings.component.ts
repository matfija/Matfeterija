import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public promenaLozinkeFormular: FormGroup;

  public promenaLozinkeTrenutno = false;

  constructor(private formBuilder: FormBuilder) { 

    this.promenaLozinkeFormular = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.proveriLozinke });
  }

  ngOnInit() {
  }

  proveriLozinke (group: FormGroup) { 
    let password = group.get('newPassword').value;
    let confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? group.get('confirmPassword').setErrors(null) : group.get('confirmPassword').setErrors({ notSame: true })     
  }
  // Dohvatanje gresaka u formularu u tekstualnoj formi
  public dohvatiGreskePromenaLozinke(uKontrola: AbstractControl, pKontrola: AbstractControl): string {
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
  public promeniLozinku(prijava: FormData): void {
    this.promenaLozinkeTrenutno = true;

    if (!this.promenaLozinkeFormular.valid) {
      // this.modalNaslov = 'Грешка при пријави';
      // this.modalPoruka = 'Формулар није исправан!';
      // this.modalPoruka += this.dohvatiGreske(this.pAlas, this.pPass);
      // this.modalDugme.nativeElement.click();
      // this.promenaLozinkeTrenutno = false;
      // return;
      console.log(this.promenaLozinkeFormular.get('oldPassword').errors)
      console.log(this.promenaLozinkeFormular.get('newPassword').errors)
      console.log(this.promenaLozinkeFormular.get('confirmPassword').errors)
    }

    // // Komunikacija sa serverom
    // this.pretplate.push(
    //   this.auth.prijaviSe(prijava).subscribe((korisnik) => {
    //     this.auth.uspesnaPrijava(korisnik);
    //   }, () => {
    //     this.modalNaslov = 'Грешка при пријави';
    //     this.modalPoruka = 'Унели сте неисправне податке или је дошло до' +
    //                        ' друге неочекиване грешке. Покушајте поново.';
    //     this.modalDugme.nativeElement.click();
    //     this.promenaLozinkeTrenutno = false;
    //   }, () => {
    //     this.promenaLozinkeFormular.reset();
    //     this.promenaLozinkeTrenutno = false;
    //   })
    // );
    this.promenaLozinkeTrenutno = false;
  }

      // Promena vidljivosti lozinki i ikonice
  public promeniVidljivost(polje: HTMLInputElement, ikona: HTMLElement): void {
    if (polje.type === 'password') {
      polje.type = 'text';
      ikona.classList.remove('fa-lock');
      ikona.classList.add('fa-unlock');
    } else {
      polje.type = 'password';
      ikona.classList.remove('fa-unlock');
      ikona.classList.add('fa-lock');
    }
 }
}
