import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InputAdornment {

    constructor() {

    }

    // Promena vidljivosti lozinki i ikonice
  public promeniVidljivost(polje: HTMLInputElement, ikona: HTMLElement): void {
    if (polje.type === 'password') {
      polje.type = 'text';
      ikona.classList.remove('fa-lock');
      ikona.classList.add('fa-unlock');
    } else {
      polje.type = 'password';
      ikona.classList.remove('fa-unlock');
      ikona.classList.add('fa-lock');
    }
 }
}
