import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.model';
import { Post } from '../interfaces/post.model';
import { PostService } from '../services/post.service';

@Pipe({
  name: 'praceni'
})
export class PraceniPipe implements PipeTransform {

  constructor(private userService: UserService,
              private postService: PostService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava pracenih korisnika
    let praceni = this.userService.korisnikPodaci.following;
    if (this.instanceOfUser(praceni)) {
      praceni = praceni.map(korisnik => korisnik._id);
    }
    return this.postService.prikaziSve ? objave :
      objave.filter((objava: any) => praceni.includes(objava.user._id));
  }

  private instanceOfUser(object: any): object is User[] {
    return object[0] && object[0]._id;
  }

}
