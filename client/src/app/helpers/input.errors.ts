import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InputErrors {
    constructor() {

    }
    // Dohvatanje gresaka u formularu u tekstualnoj formi
  public dohvatiGreske(kontrola: AbstractControl, komponenta: string): string {
    let poruka = '';

    const greske = kontrola.errors;
    if (greske) {
        if (greske.required) {
            switch (komponenta) {
                case 'alas':
                    poruka += ' Налог на Аласу је обавезно поље формулара.';
                    break;
                case 'password':
                    poruka += ' Лозинка је обавезно поље формулара.';
                    break;
                case 'oldPassword':
                    poruka += ' Стара лозинка је обавезно поље формулара.';
                    break;
                case 'newPassword':
                    poruka += ' Нова лозинка је обавезно поље формулара.';
                    break;
                case 'confirmPassword':
                    poruka += ' Потврда лозинке је обавезно поље формулара.';
                    break;
                case 'display':
                    poruka += ' Име за приказивање је обавезно поље формулара.';
                    break;
                default:
                    break;
            }
        } else if (greske.pattern) {
            switch (komponenta) {
                case 'alas':
                    poruka += ' Налог на Аласу мора да се уклопи у шаблон именовања (нпр. mi16099).';
                    break;
                default:
                    break;
            }
        } else if (greske.minlength) {
            switch (komponenta) {
                case 'password':
                    poruka += ' Лозинка мора бити макар дужине 8 (осам) карактера.';
                    break;
                case 'oldPassword':
                    poruka += ' Стара лозинка мора бити макар дужине 8 (осам) карактера.';
                    break;
                case 'newPassword':
                    poruka += ' Нова лозинка мора бити макар дужине 8 (осам) карактера.';
                    break;
                case 'confirmPassword':
                    poruka += ' Потврда лозинке мора бити макар дужине 8 (осам) карактера.';
                    break;
                case 'display':
                    poruka += ' Име за приказиванје мора бити макар дужине 3 (три) карактера.';
                    break;
                default:
                    break;
            }
        } else if (greske.notsame) {
            poruka += ' Потврда лозинке мора бити иста као лозинка.';
        }
    }

    return poruka;
  }
}
