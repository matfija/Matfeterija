import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputErrors } from '../../helper.services/input.errors';
import { PostService } from '../../data.services/post.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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

  public teme = [];
  public temePodesavanja:IDropdownSettings = {};

  constructor(private formBuilder: FormBuilder,
              private inputErrors: InputErrors,
              private postService: PostService) {
    this.objavaFormular = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      topics: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.teme = ['Испити', 'Управа', "Забава", "Разно"];
    this.temePodesavanja = {
      singleSelection: false,
      idField: 'tema_id',
      textField: 'tema_text',
      selectAllText: 'Селектујте све',
      unSelectAllText: 'Поништите све',
    }
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
    this.objavaFormular.reset();
  }

  public kreirajObjavu(forma: FormData): void {
    this.objavljivanjeTrenutno = true;

    if (!this.objavaFormular.valid) {
      this.modalNaslov = 'Грешка при објављивању';
      this.modalPoruka = 'Формулар није исправан!';
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.objavaFormular.get('title'), 'title');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.objavaFormular.get('content'), 'content');
      this.modalPoruka += this.inputErrors.dohvatiGreske(this.objavaFormular.get('topics'), 'topics');
      this.prikaziModal = true;
      this.objavljivanjeTrenutno = false;
      return;
    }

    this.pretplate.push(
      this.postService.kreirajObjavu(forma).subscribe((objava) => {
      }, () => {
          this.modalNaslov = 'Грешка при објављивању';
          this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
          this.prikaziModal = true;
          this.objavljivanjeTrenutno = false;
      }, () => {
        this.sakrijFormu();
        this.objavljivanjeTrenutno = false;
        this.postService.osveziObjave();
      })
    );
  }
}
