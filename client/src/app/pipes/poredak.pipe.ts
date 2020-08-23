import { Pipe, PipeTransform } from '@angular/core';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'poredak'
})
export class PoredakPipe implements PipeTransform {

  constructor(private optionsService: OptionsService) {}

  transform(objave: any[]): any[] {
    if (!objave) { return []; }

    // Obrtanje poretka
    return this.optionsService.obrni ? objave.reverse() : objave;
  }

}
