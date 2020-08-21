import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { EscRegExp } from '../helpers/esc-reg-exp';
import { PostsOptionsComponent } from '../components/posts-options/posts-options.component';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor() {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih korisnika
    const reg = new EscRegExp(PostsOptionsComponent.user, 'i');
    return objave.filter((objava: any) => {
      const korisnik = objava.user;
      return korisnik.alas.match(reg) || korisnik.display && korisnik.display.match(reg);
    });
  }

}
