import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts-options',
  templateUrl: './posts-options.component.html',
  styleUrls: ['./posts-options.component.css']
})
export class PostsOptionsComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit() {
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

}
