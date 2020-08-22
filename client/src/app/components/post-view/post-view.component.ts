import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { RouterNavigation } from '../../helper.services/router.navigation';
import { PostService } from '../../data.services/post.service';
import { UserService } from '../../data.services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit, OnDestroy, OnChanges {

  private pretplate: Subscription[] = [];

  public korisnikLajkovao: boolean;

  @Input()
  public korisnik;

  @Input()
  public objava;

  @Input()
  public objavaStrana;

  constructor(public routerNavigation: RouterNavigation,
              private postService: PostService,
              private userService: UserService) {
  }

  ngOnInit() {
    if(this.objava.likes.includes(this.userService.korisnikPodaci._id)) {
      this.korisnikLajkovao = true;
    } else {
      this.korisnikLajkovao = false;
    }
  }

  ngOnChanges() {
    if(this.objava.likes.includes(this.userService.korisnikPodaci._id)) {
      this.korisnikLajkovao = true;
    } else {
      this.korisnikLajkovao = false;
    }

    console.log(this.objava);
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  lajkujObjavu() {
    this.pretplate.push(
      this.postService.lajkujObjavu(this.objava._id).subscribe((objava) => {
        if(this.korisnikLajkovao) {
          this.korisnikLajkovao = false;
        } else {
          this.korisnikLajkovao = true;
        }
        this.postService.osveziObjave();
        // mora i ovo zbog prikaza u post-page
        this.objava = objava;
        console.log(objava)
      }, (greska) => {
        console.log(greska);
      })
    )
  }

  obrisiObjavu() {
    this.pretplate.push(
      this.postService.obrisiObjavu(this.objava._id).subscribe((objava) => {
        this.postService.osveziObjave();
        console.log(objava)
      }, (greska) => {
        console.log(greska);
      })
    )
  }
}
