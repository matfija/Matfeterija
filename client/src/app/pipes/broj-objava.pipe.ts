import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { User } from '../interfaces/user.model';

@Pipe({
  name: 'brojObjava'
})
export class BrojObjavaPipe implements PipeTransform {

  transform(objave: Post[], korisnik: User): number {
    return objave.filter(o => o.user._id === korisnik._id).length;
  }

}
