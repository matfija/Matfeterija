import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Post } from '../interfaces/post.model';
import { Comm } from '../interfaces/comm.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private static readonly postLink = 'http://localhost:3000/post/';

  private sveObjave: Post[];

  constructor(private http: HttpClient) {
    // HTTP je protokol bez stanja, tako da je neophodno
    // rucno osveziti svaki dohvaceni entitet; ovde se
    // na svaki minut osvezavaju sve objave za prikaz
    setTimeout(() => {
      this.osveziObjave();
    }, 60000);
  }

  public kreirajObjavu(forma: FormData): Observable<Post> {
    return this.http.post<Post>(PostService.postLink, forma).pipe(shareReplay());
  }

  public dohvatiSveObjave(): Observable<Post[]> {
    return this.http.get<Post[]>(PostService.postLink).pipe(shareReplay());
  }

  public osveziObjave(): void {
    let pretplata: Subscription;
    new Promise((resolve, reject) => {
      pretplata = this.dohvatiSveObjave().subscribe((sveObjave) => {
        resolve(sveObjave);
      }, (greska) => {
        reject(greska);
      });
    }).then((sveObjave: Post[]) => {
      this.sveObjave = sveObjave;
    }).catch((greska) => {
      console.log(greska);
    }).finally(() => {
      pretplata.unsubscribe();
    });
  }

  public obrisiObjavu(id): Observable<Post> {
    return this.http.delete<Post>(PostService.postLink + id).pipe(shareReplay());
  }

  public lajkujObjavu(id: string) {
    return this.http.patch<Post>(PostService.postLink + id, {}).pipe(shareReplay());
  }

  public dohvatiObjavu(id: string): Observable<[Post, [Comm]]> {
    return this.http.get<[Post, [Comm]]>(PostService.postLink + id).pipe(shareReplay());
  }

  public komentarisiObjavu(id: string, forma: FormData): Observable<Post> {
    return this.http.post<Post>(PostService.postLink + id, forma).pipe(shareReplay());
  }

  public get sveObjavePodaci(): Post[] {
    return this.sveObjave;
  }
}
