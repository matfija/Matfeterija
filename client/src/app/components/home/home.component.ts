import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  constructor(public userService: UserService,
              public postService: PostService) { 
                this.pretplate.push(
                  this.postService.dohvatiSveObjave().subscribe((sveObjave) => {
                    console.log(sveObjave)
                    this.postService.sveObjavePodaci = sveObjave;
                  }, (greska) => {
                    console.log(greska);
                  })
                )
              }

  ngOnInit() {
  
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

}
