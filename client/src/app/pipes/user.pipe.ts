import { Pipe, PipeTransform } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.model';
import { EscRegExp } from '../helpers/esc-reg-exp';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(private postService: PostService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih korisnika
    const reg = new EscRegExp(this.postService.user, 'i');
    return objave.filter((objava: any) => {
      const korisnik = objava.user;
      return korisnik.alas.match(reg) || korisnik.display && korisnik.display.match(reg);
    });
  }

}
