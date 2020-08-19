import { Pipe, PipeTransform } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.model';

@Pipe({
  name: 'poredak'
})
export class PoredakPipe implements PipeTransform {

  constructor(private postService: PostService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Obrtanje poretka
    return this.postService.obrni ? objave.reverse() : objave;
}

}
