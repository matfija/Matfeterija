import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  public prikaziSve = false;
  public obrni = false;
  public user = '';
  public post = '';
  public selTeme: string[] = [];

  constructor() { }
}
