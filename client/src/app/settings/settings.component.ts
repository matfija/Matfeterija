import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InputAdornment } from '../helpers/input.adornment';
import { InputErrors } from '../helpers/input.errors';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private pretplate: Subscription[] = [];

  public promenaLozinkeFormular: FormGroup;
  public promenaProfilaFormular: FormGroup;

  public promenaLozinkeTrenutno = false;
  public promenaProfilaTrenutno = false;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  public trenutnoIzabraniAvatar = null;

  constructor(private formBuilder: FormBuilder,
              private inputErrors: InputErrors,
              public inputAdornment: InputAdornment,
              public userService: UserService) {

    this.promenaLozinkeFormular = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.proveriLozinke });

    this.promenaProfilaFormular = this.formBuilder.group({
      avatar: [userService.korisnikPodaci.avatar],
      display: [userService.korisnikPodaci.display, [Validators.required, Validators.minLength(3)]],
      description: [userService.korisnikPodaci.description]
    });

    // mora ovako zbog textarea
    // this.promenaProfilaFormular.controls.description.setValue(userService.korisnikPodaci.description);
  }

  ngOnInit() {
    this.trenutnoIzabraniAvatar = this.userService.korisnikPodaci.avatar;
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  proveriLozinke(group: FormGroup) {
    const password = group.get('newPassword').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ?
      group.get('confirmPassword').setErrors(group.get('confirmPassword').errors) :
      group.get('confirmPassword').setErrors({ notsame: true });
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
          this.trenutnoIzabraniAvatar = this.promenaProfilaFormular.get('avatar');
          this.promenaProfilaTrenutno = false;
      }, () => {
        this.promenaLozinkeFormular.reset();
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

}
