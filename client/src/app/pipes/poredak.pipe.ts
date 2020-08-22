import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { OptionsService } from '../services/options.service';

@Pipe({
  name: 'poredak'
})
export class PoredakPipe implements PipeTransform {

  constructor(private optionsService: OptionsService) {}

  transform(objave: Post[]): Post[] {
    if (!objave) { return []; }

    // Obrtanje poretka
    return this.optionsService.obrni ? objave.reverse() : objave;
}

}
