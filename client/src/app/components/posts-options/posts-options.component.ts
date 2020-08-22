import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-posts-options',
  templateUrl: './posts-options.component.html',
  styleUrls: ['./posts-options.component.css']
})
export class PostsOptionsComponent implements OnInit {

  public static prikaziSve = false;
  public static obrni = false;
  public static user = '';
  public static post = '';
  public static selTeme: string[] = [];

  public teme: string[];
  public selektovaneTeme: string[];
  public temePodesavanja: IDropdownSettings;

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.teme = ['Испити', 'Управа', 'Забава', 'Разно'];
    this.temePodesavanja = {
      singleSelection: false,
      idField: 'tema_id',
      textField: 'tema_text',
      selectAllText: 'Селектујте све',
      unSelectAllText: 'Поништите све',
    };
    this.selektovaneTeme = this.teme;
    PostsOptionsComponent.selTeme = this.teme;
  }

  public osveziObjave(element: string | string[] | HTMLInputElement | HTMLSelectElement): void {
    if (element instanceof Array) {
      PostsOptionsComponent.selTeme = element;
    } else if (typeof element === 'string') {
      PostsOptionsComponent.selTeme = this.selektovaneTeme;
    } else if (element instanceof HTMLSelectElement) {
      PostsOptionsComponent.obrni = JSON.parse(element.value);
    } else if (element.type === 'checkbox') {
      PostsOptionsComponent.prikaziSve = !element.checked;
    } else if (element.name === 'user') {
      PostsOptionsComponent.user = element.value.trim();
    } else {
      PostsOptionsComponent.post = element.value.trim();
    }

    this.postService.osveziObjave();
  }
}
