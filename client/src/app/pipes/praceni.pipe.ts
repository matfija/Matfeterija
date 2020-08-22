import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../data.services/user.service';
import { User } from '../interfaces/user.model';
import { Post } from '../interfaces/post.model';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'praceni'
})
export class PraceniPipe implements PipeTransform {

  constructor(private userService: UserService,
              private optionsService: OptionsService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava pracenih korisnika
    const korisnik = this.userService.korisnikPodaci;
    let praceni = korisnik.following;
    if (this.instanceOfUser(praceni)) {
      praceni = praceni.map(kor => kor._id);
    }
    return this.optionsService.prikaziSve ? objave :
      objave.filter((objava: any) =>
        korisnik._id === objava.user._id || praceni.includes(objava.user._id)
      );
  }

  private instanceOfUser(object: any): object is User[] {
    return object[0] && object[0]._id;
  }

}
