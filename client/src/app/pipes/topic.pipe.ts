import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'topic'
})
export class TopicPipe implements PipeTransform {

  constructor(private optionsService: OptionsService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranih tema
    return objave.filter(
      objava => objava.topics.some(
        tema => this.optionsService.selTeme.includes(tema)
      )
    );
  }

}
