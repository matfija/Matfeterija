import { Component, OnInit } from '@angular/core';
import { RouterNavigation } from '../../helper.services/router.navigation';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private routerNavigation: RouterNavigation) {
    this.routerNavigation.idiNaPocetnuStranu();
  }

  ngOnInit() {
  }

}
