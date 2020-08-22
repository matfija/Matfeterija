import { Component, OnInit, Input } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-posts-options',
  templateUrl: './posts-options.component.html',
  styleUrls: ['./posts-options.component.css']
})
export class PostsOptionsComponent implements OnInit {

  private static prviPut = true;

  @Input()
  public mesto: string;

  private teme: string[];
  private selektovaneTeme: string[];
  public temePodesavanja: IDropdownSettings;

  constructor(private postService: PostService,
              private optionsService: OptionsService) {}

  ngOnInit() {
    this.teme = ['Испити', 'Управа', 'Забава', 'Разно'];
    this.temePodesavanja = {
      singleSelection: false,
      idField: 'tema_id',
      textField: 'tema_text',
      selectAllText: 'Селектујте све',
      unSelectAllText: 'Поништите све',
    };

    if (PostsOptionsComponent.prviPut) {
      this.selektovaneTeme = this.teme;
      this.optionsService.selTeme = this.teme;
      PostsOptionsComponent.prviPut = false;
    } else {
      this.selektovaneTeme = this.optionsService.selTeme;
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
  }
}
