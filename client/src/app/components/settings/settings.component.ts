import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InputAdornment } from '../../helpers/input.adornment';
import { InputErrors } from '../../helpers/input.errors';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { compareSync } from 'bcryptjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private pretplate: Subscription[] = [];

  public promenaLozinkeFormular: FormGroup;
  public promenaProfilaFormular: FormGroup;
  public brisanjeNalogaFormular: FormGroup;

  public promenaLozinkeTrenutno = false;
  public promenaProfilaTrenutno = false;
  public brisanjeNalogaTrenutno = false;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  public trenutnoIzabraniAvatar: string | ArrayBuffer;

  constructor(private formBuilder: FormBuilder,
              private inputErrors: InputErrors,
              public inputAdornment: InputAdornment,
              public userService: UserService) {

    this.promenaLozinkeFormular = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.proveriLozinke.bind(this, 'newPassword', 'confirmPassword') });

    this.promenaProfilaFormular = this.formBuilder.group({
      avatar: [userService.korisnikPodaci.avatar],
      display: [userService.korisnikPodaci.display, [Validators.required, Validators.minLength(3)]],
      description: [userService.korisnikPodaci.description]
    });

    this.brisanjeNalogaFormular = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.proveriLozinke.bind(this, 'password', 'confirmPassword') });

  }

  ngOnInit() {
    this.trenutnoIzabraniAvatar = this.userService.korisnikPodaci.avatar;
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  proveriLozinke(password1: string, password2: string, group: FormGroup) {
    const password = group.get(password1).value;
    const confirmPassword = group.get(password2).value;

    if (password === confirmPassword) {
      const greske = group.get(password2).errors;
      if (!greske || Object.keys(greske).length === 1 && greske.notsame) {
        group.get(password2).setErrors(null);
      }
    } else {
      group.get(password2).setErrors({ notsame: true });
    }
  }

  // Reakcija na promenu file inputa
  public promenaAvatara(event) {
    // po uzoru na https://www.twilio.com/blog/transfer-files-data-javascript-applications-angular-node-js
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.promenaProfilaFormular.patchValue({
          avatar: reader.result
        });
        this.trenutnoIzabraniAvatar = reader.result;
      };
    }
  }

  public izmeniPodatkeProfila(forma: FormData): void {
    this.promenaProfilaTrenutno = true;

    if (!this.promenaProfilaFormular.valid) {
      this.modalNaslov = 'Грешка при промени профила';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.promenaProfilaFormular.get('display'), 'display');
      this.prikaziModal = true;
      this.promenaProfilaTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.userService.azurirajKorisnika(forma).subscribe((korisnik) => {
        this.userService.korisnikPodaci = korisnik;
        this.trenutnoIzabraniAvatar = korisnik.avatar;
        this.promenaProfilaFormular.patchValue({
          avatar: korisnik.avatar
        });
        this.modalNaslov = 'Успешнo ажурирање профила';
        this.modalPoruka = 'Ваши подаци су измењени';
        this.prikaziModal = true;
      }, () => {
          this.modalNaslov = 'Грешка при ажурирању';
          this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.trenutnoIzabraniAvatar = this.promenaProfilaFormular.get('avatar').value;
          this.promenaProfilaTrenutno = false;
      }, () => {
        this.promenaProfilaTrenutno = false;
      })
    );
  }

  // Reakcija na prijavu
  public promeniLozinku(forma: FormData): void {
    this.promenaLozinkeTrenutno = true;

    if (!this.promenaLozinkeFormular.valid) {
      this.modalNaslov = 'Грешка при промени лозинке';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.promenaLozinkeFormular.get('oldPassword'), 'oldPassword');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.promenaLozinkeFormular.get('newPassword'), 'newPassword');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.promenaLozinkeFormular.get('confirmPassword'), 'confirmPassword');
      this.prikaziModal = true;
      this.promenaLozinkeTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.userService.azurirajKorisnika(forma).subscribe(() => {
        this.modalNaslov = 'Успешна промена лозинке';
        this.modalPoruka = 'Сада се можете пријављивати помоћу нове лозинке';
        this.prikaziModal = true;
      }, () => {
          this.modalNaslov = 'Грешка при промени лозинке';
          this.modalPoruka = 'Унели сте неисправну стару лозинку, стара лозинка је иста као нова или је дошло до' +
                            ' друге неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.promenaLozinkeTrenutno = false;
      }, () => {
        this.promenaLozinkeFormular.reset();
        this.promenaLozinkeTrenutno = false;
      })
    );
  }

  public obrisiNalog(forma: FormData): void {
    this.brisanjeNalogaTrenutno = true;

    if (!this.brisanjeNalogaFormular.valid) {
      this.modalNaslov = 'Грешка при брисању профила';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.brisanjeNalogaFormular.get('password'), 'password');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.brisanjeNalogaFormular.get('confirmPassword'), 'confirmPassword');
      this.prikaziModal = true;
      this.brisanjeNalogaTrenutno = false;
      return;
    }

    if (!compareSync(this.brisanjeNalogaFormular.get('password').value, this.userService.korisnikPodaci.password)) {
      this.modalNaslov = 'Грешка при брисању налога';
      this.modalPoruka = 'Унели сте неисправну лозинку.';
      this.prikaziModal = true;
      this.brisanjeNalogaTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.userService.obrisiKorisnika().subscribe(() => {
        this.modalNaslov = 'Успешно брисање налога';
        this.modalPoruka = 'Ваш налог је сада обрисан.';
        this.prikaziModal = true;
      }, () => {
          this.modalNaslov = 'Грешка при брисању налога';
          this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.brisanjeNalogaTrenutno = false;
      }, () => {
        this.brisanjeNalogaFormular.reset();
        this.brisanjeNalogaTrenutno = false;
      })
    );
  }

}
