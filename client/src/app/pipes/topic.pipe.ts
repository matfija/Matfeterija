import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { PostsOptionsComponent } from '../components/posts-options/posts-options.component';

@Pipe({
  name: 'topic'
})
export class TopicPipe implements PipeTransform {

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih tema
    return objave.filter(
      objava => objava.topics.some(
        tema => PostsOptionsComponent.selTeme.includes(tema)
      )
    );
  }

}
