import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-posts-options',
  templateUrl: './posts-options.component.html',
  styleUrls: ['./posts-options.component.css']
})
export class PostsOptionsComponent implements OnInit {

  public pretrage: FormGroup;

  public teme = [];
  public temePodesavanja:IDropdownSettings = {};

  constructor(private postService: PostService,
              private formBuilder: FormBuilder) { 
    this.pretrage = formBuilder.group({
      'user': ['', [Validators.required]],
      'post': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.teme = ['Испити', 'Управа', "Забава", "Разно"];
    this.temePodesavanja = {
      singleSelection: false,
      idField: 'tema_id',
      textField: 'tema_text',
      selectAllText: 'Селектујте све',
      unSelectAllText: 'Поништите све',
    }
  }

  public osveziObjave(element: HTMLInputElement | HTMLSelectElement): void {
    if (element instanceof HTMLSelectElement) {
      this.postService.obrni = JSON.parse(element.value);
    } else if (element.type === 'checkbox') {
      this.postService.prikaziSve = element.checked;
    } else if (element.name === 'user') {
      this.postService.user = element.value.trim();
    } else {
      this.postService.post = element.value.trim();
    }

    this.postService.osveziObjave();
  }

  selektovanjeTema(tema: any) {

  }
}
