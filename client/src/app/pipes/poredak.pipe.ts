import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { PostsOptionsComponent } from '../components/posts-options/posts-options.component';

@Pipe({
  name: 'poredak'
})
export class PoredakPipe implements PipeTransform {

  constructor() {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Obrtanje poretka
    return PostsOptionsComponent.obrni ? objave.reverse() : objave;
}

}
