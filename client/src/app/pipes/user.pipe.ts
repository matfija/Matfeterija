import { Pipe, PipeTransform } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.model';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(private postService: PostService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih korisnika
    const reg = new RegExp(this.postService.user, 'i');
    return objave.filter((objava: any) => {
      const korisnik = objava.user;
      return korisnik.alas.match(reg) || korisnik.display && korisnik.display.match(reg);
    });
  }

}
