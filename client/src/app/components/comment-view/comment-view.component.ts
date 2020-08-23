import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.css']
})

export class CommentViewComponent implements OnInit {

  @Input()
  public komentar: Comment;

  constructor() { }

  ngOnInit() {
  }

}
