import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/data.services/post.service';
import { Post } from 'src/app/interfaces/post.model';
import { Comm } from 'src/app/interfaces/comm.model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit, OnDestroy {

  private id: string;
  private pretplate: Subscription[] = [];
  private tajmer: NodeJS.Timer;

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

  public komentari: Comm[] = [];

  public modalNaslov: string;
  public modalPoruka: string;
  public prikaziModal = false;

  constructor(private activatedRoute: ActivatedRoute,
              private postService: PostService) {
    this.activatedRoute.paramMap.subscribe((parametri) => {
      this.id = parametri.get('id');
      this.osveziObjavu();

      // Periodicno osvezavanje jer je HTTP bez stanja
      this.tajmer = setInterval(() => {
        this.osveziObjavu();
      }, 60000);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearInterval(this.tajmer);
    this.pretplate.forEach(pretplata => pretplata.unsubscribe());
  }


  osveziObjavu() {
    this.pretplate.push(
      this.postService.dohvatiObjavu(this.id).subscribe((rezultat) => {
        [this.objava, this.komentari] = rezultat;
      }, () => {
        this.modalNaslov = 'Грешка при дохватању објаве';
        this.modalPoruka = 'Дошло је до неочекиване грешке. Покушајте поново.';
        this.prikaziModal = true;
      })
    );
  }

}
