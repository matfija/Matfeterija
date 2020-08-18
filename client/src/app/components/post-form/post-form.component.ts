import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputErrors } from 'src/app/helpers/input.errors';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  public objavaFormular: FormGroup;

  public objavljivanjeTrenutno = false;

  public prikaziFormuObjave = false;

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  constructor(private formBuilder: FormBuilder,
              private inputErrors: InputErrors,
              private postService: PostService) {
    this.objavaFormular = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // Otkazivanje svih pretplata kako ne bi curela memorija
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }
  prikaziFormu() {
    this.prikaziFormuObjave = true;
  }

  sakrijFormu() {
    this.prikaziFormuObjave = false;
  }

  public kreirajObjavu(forma: FormData): void {
    this.objavljivanjeTrenutno = true;

    if (!this.objavaFormular.valid) {
      this.modalNaslov = 'Грешка при објављивању';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.objavaFormular.get('title'), 'title');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.objavaFormular.get('content'), 'content');
      this.prikaziModal = true;
      this.objavljivanjeTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.postService.kreirajObjavu(forma).subscribe((objava) => {
        console.log(objava);
        this.modalNaslov = 'Успешнo објављивање';
        this.modalPoruka = 'Ваша објава се сада може видети';
        this.prikaziModal = true;
      }, () => {
          this.modalNaslov = 'Грешка при објављивању';
          this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.objavljivanjeTrenutno = false;
      }, () => {
        this.objavaFormular.reset();
        this.objavljivanjeTrenutno = false;
      })
    );
  }
}
