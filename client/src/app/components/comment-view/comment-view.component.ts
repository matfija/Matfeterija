import { Component, OnInit, Input, OnDestroy, OnChanges, EventEmitter, Output } from '@angular/core';
import { RouterNavigation } from '../../helper.services/router.navigation';
import { UserService } from 'src/app/data.services/user.service';
import { Subscription } from 'rxjs';
import { Comm } from './../../interfaces/comm.model';
import { CommentService } from 'src/app/data.services/comment.service';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.css']
})

export class CommentViewComponent implements OnInit, OnDestroy, OnChanges {

  private pretplate: Subscription[] = [];

  @Input()
  public komentar: Comm;

  @Output()
  public osvezavanjeObjaveEvent = new EventEmitter();

  public korisnikLajkovao: boolean;

  constructor(public userService: UserService,
              public commentService: CommentService,
              public routerNavigation: RouterNavigation) { }

  ngOnInit() {
    if (this.komentar.likes.includes(this.userService.korisnikPodaci._id)) {
      this.korisnikLajkovao = true;
    } else {
      this.korisnikLajkovao = false;
    }
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  ngOnChanges() {
    if (this.komentar.likes.includes(this.userService.korisnikPodaci._id)) {
      this.korisnikLajkovao = true;
    } else {
      this.korisnikLajkovao = false;
    }
  }

  lajkujKomentar() {
    this.pretplate.push(
      this.commentService.lajkujKomentar(this.komentar._id).subscribe(() => {
        this.korisnikLajkovao = !this.korisnikLajkovao;
        this.osvezavanjeObjaveEvent.emit();
      })
    );
  }

  obrisiKomentar() {
    this.pretplate.push(
      this.commentService.obrisiKomentar(this.komentar._id).subscribe(() => {
        this.osvezavanjeObjaveEvent.emit();
      })
    );
  }

}
