import { Component, OnInit } from '@angular/core';
import { UserService } from '../../data.services/user.service';
import { PostService } from '../../data.services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public userService: UserService,
              public postService: PostService) {
    this.postService.osveziObjave();
  }

  ngOnInit() {
  }

}
