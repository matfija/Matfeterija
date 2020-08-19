import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from "@angular/common";
import { RouterNavigation } from '../../helpers/router.navigation';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  @Input()
  public korisnik;

  @Input()
  public objava;

  constructor(public routerNavigation: RouterNavigation) { }

  ngOnInit() {
  }
}
