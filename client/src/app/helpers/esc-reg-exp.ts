// Korisnicka klasa koja pravi regularni izraz od sirove niske,
// pravilno escape-ujuci svaki specijalni karakter
export class EscRegExp extends RegExp {

  constructor(pattern: string, flags?: string) {
    super(pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
  }

}
