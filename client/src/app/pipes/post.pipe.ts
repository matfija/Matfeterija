import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { EscRegExp } from '../helpers/esc-reg-exp';
import { PostsOptionsComponent } from '../components/posts-options/posts-options.component';

@Pipe({
  name: 'post'
})
export class PostPipe implements PipeTransform  {

  constructor() {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranog sadrzaja
    const reg = new EscRegExp(PostsOptionsComponent.post, 'i');
    return objave.filter(objava =>
      objava.title.match(reg) || objava.content.match(reg)
    );
  }

}
