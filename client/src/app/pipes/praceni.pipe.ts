import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../data.services/user.service';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'praceni'
})
export class PraceniPipe implements PipeTransform {

  constructor(private userService: UserService,
              private optionsService: OptionsService) {}

  transform(objave: any[]): any[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava pracenih korisnika
    const korisnik = this.userService.korisnikPodaci;
    const praceni = korisnik.following;
    return this.optionsService.prikaziSve ? objave :
      objave.filter(objava =>
        korisnik._id === objava.user._id || praceni.includes(objava.user._id)
      );
  }

}
