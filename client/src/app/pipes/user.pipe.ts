import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { EscRegExp } from '../helper.services/esc-reg-exp';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(private optionsService: OptionsService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih korisnika
    const reg = new EscRegExp(this.optionsService.user, 'i');
    return objave.filter((objava: any) => {
      const korisnik = objava.user;
      return korisnik.alas.match(reg) || korisnik.display && korisnik.display.match(reg);
    });
  }

}
