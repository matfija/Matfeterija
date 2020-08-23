import { Pipe, PipeTransform } from '@angular/core';
import { EscRegExp } from '../helper.services/esc-reg-exp';
import { OptionsService } from '../data.services/options.service';

@Pipe({
  name: 'post'
})
export class PostPipe implements PipeTransform  {

  constructor(private optionsService: OptionsService) {}

  transform(objave: any[]): any[] {
    if (!objave) { return []; }

    // Prikazivanje samo objava odabranog sadrzaja
    const reg = new EscRegExp(this.optionsService.post, 'i');
    return objave.filter(objava =>
      objava.title && objava.title.match(reg) || objava.content.match(reg)
    );
  }

}
