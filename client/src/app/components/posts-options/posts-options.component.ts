import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PostService } from '../../data.services/post.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OptionsService } from '../../data.services/options.service';

@Component({
  selector: 'app-posts-options',
  templateUrl: './posts-options.component.html',
  styleUrls: ['./posts-options.component.css']
})
export class PostsOptionsComponent implements OnInit {

  private static prviPut = true;

  @Input()
  public mesto: string;

  @Output()
  public osvezavanjeObjaveEvent = new EventEmitter();

  public teme: string[];
  public selektovaneTeme: string[];
  public temePodesavanja: IDropdownSettings;

  constructor(private postService: PostService,
              public optionsService: OptionsService) {}

  ngOnInit() {
    this.teme = ['Испити', 'Управа', 'Забава', 'Разно'];
    this.temePodesavanja = {
      singleSelection: false,
      idField: 'tema_id',
      textField: 'tema_text',
      selectAllText: 'Изабери све',
      unSelectAllText: 'Поништи све',
    };

    // Prva inicijalizacija komponente ide od lokala
    // ka servisu, a svaka sledeca u obrnutom smeru
    if (PostsOptionsComponent.prviPut) {
      this.selektovaneTeme = this.teme;
      this.optionsService.selTeme = this.teme;
      PostsOptionsComponent.prviPut = false;
    } else {
      this.selektovaneTeme = this.optionsService.selTeme;
    }

    // Van profila su regexi podrazumevano prazni
    if (this.mesto !== 'profile') {
      this.optionsService.user = '';
      this.optionsService.post = '';
    }

    // Na objavama se podrazumevano vide svi komentari,
    // dok se na pocetnoj vide samo objave pracenih
    if (this.mesto === 'home') {
      this.optionsService.prikaziSve = false;
    } else if (this.mesto === 'post') {
      this.optionsService.prikaziSve = true;
    }
  }

  public osveziObjave(element: string | string[] | HTMLInputElement | HTMLSelectElement): void {
    if (element instanceof Array) {
      this.optionsService.selTeme = element;
    } else if (typeof element === 'string') {
      this.optionsService.selTeme = this.selektovaneTeme;
    } else if (element instanceof HTMLSelectElement) {
      this.optionsService.obrni = JSON.parse(element.value);
    } else if (element.type === 'checkbox') {
      this.optionsService.prikaziSve = !element.checked;
    } else if (element.name === 'user') {
      this.optionsService.user = element.value.trim();
    } else {
      this.optionsService.post = element.value.trim();
    }

    this.postService.osveziObjave();
    this.osvezavanjeObjaveEvent.emit();
  }
}
