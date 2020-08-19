import { Pipe, PipeTransform } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.model';
import { EscRegExp } from '../helpers/esc-reg-exp';

@Pipe({
  name: 'post'
})
export class PostPipe implements PipeTransform  {

  constructor(private postService: PostService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranog sadrzaja
    const reg = new EscRegExp(this.postService.post, 'i');
    return objave.filter(objava =>
      objava.title.match(reg) || objava.content.match(reg)
    );
  }

}
