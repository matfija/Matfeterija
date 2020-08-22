import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/data.services/post.service';
import { Post } from 'src/app/interfaces/post.model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit, OnDestroy {

  private pretplate: Subscription[] = [];

  private id: string;

  public objava: Post = {
    _id: null,
    user: {
      _id: null,
      alas: null,
      password: null,
      followers: [],
      following: []
    },
    title: null,
    content: null,
    likes: [null],
    topics: [null],
    comms: null,
    date: null
  };

  public komentari = [];

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  constructor(private activatedRoute: ActivatedRoute,
              private postService: PostService) { 
    this.pretplate.push(
      this.activatedRoute.paramMap.subscribe((parametri) => {
        this.id = parametri.get('id');
        // this.optionsService.user = this.alas;
        this.dohvatiObjavu(this.id);
      }, (greska) => {
        console.log(greska);
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }

  dohvatiObjavu(id) {
    this.pretplate.push(
      this.postService.dohvatiObjavu(id).subscribe((rezultat) => {
        [this.objava, this.komentari] = rezultat;
      }, (greska) => {
        console.log(greska);
        this.modalNaslov = 'Грешка при дохватању објаве';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
      })
    );
  }

}
