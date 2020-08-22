import { Component, OnInit } from '@angular/core';
import { UserService } from '../../data.services/user.service';
import { RouterNavigation } from '../../helper.services/router.navigation';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit {

  constructor(public userService: UserService,
              public routerNavigation: RouterNavigation) { }

  ngOnInit() {
    this.userService.osveziAktivne();
  }

}
