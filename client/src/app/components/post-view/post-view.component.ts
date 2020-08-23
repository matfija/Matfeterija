import { Component, OnInit, Input, OnDestroy, OnChanges, Output } from '@angular/core';
import { RouterNavigation } from '../../helper.services/router.navigation';
import { PostService } from '../../data.services/post.service';
import { UserService } from '../../data.services/user.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputErrors } from 'src/app/helper.services/input.errors';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit, OnDestroy, OnChanges {

  private pretplate: Subscription[] = [];

  public komentarFormular: FormGroup;

  public korisnikLajkovao: boolean;

  public prikazFormeKomentara = false;

  public komentarisanjeTrenutno = false;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  @Input()
  public korisnik;

  @Input()
  public objava;

  @Input()
  public objavaStrana;

  @Output()
  public osvezavanjeObjaveEvent = new EventEmitter();

  constructor(public routerNavigation: RouterNavigation,
              private postService: PostService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private inputErrors: InputErrors) {
      this.komentarFormular = this.formBuilder.group({
        content: ['', [Validators.required]],
      });
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
        if(this.objavaStrana) {
          this.osvezavanjeObjaveEvent.emit();
        }
        console.log(objava);
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

  prikaziFormuKomentara() {
    this.prikazFormeKomentara = true;
  }

  sakrijFormuKomentara() {
    this.prikazFormeKomentara = false;
    this.komentarFormular.reset();
  }

  kreirajKomentar(forma: FormData): void {
    this.komentarisanjeTrenutno = true;

    if (!this.komentarFormular.valid) {
      this.modalNaslov = 'Грешка при коментарисању';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.komentarFormular.get('content'), 'comment');
      this.prikaziModal = true;
      this.komentarisanjeTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.postService.komentarisiObjavu(this.objava._id,forma).subscribe((komentar) => {
        this.osvezavanjeObjaveEvent.emit();
        console.log(komentar);
      }, (greska) => {
          this.modalNaslov = 'Грешка при коментарисању';
          this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.komentarisanjeTrenutno = false;
          console.log(greska);
      }, () => {
        this.sakrijFormuKomentara();
        this.komentarisanjeTrenutno = false;
      })
    );
  }
}
