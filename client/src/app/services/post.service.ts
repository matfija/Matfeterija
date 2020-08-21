import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Post } from '../interfaces/post.model';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private static readonly postLink = 'http://localhost:3000/post';

  private sveObjave: Post[];

  public prikaziSve = false;
  public obrni = false;
  public user = '';
  public post = '';

  constructor(private http: HttpClient) {}

  public kreirajObjavu(forma: FormData): Observable<Post> {
    return this.http.post<Post>(PostService.postLink, forma).pipe(shareReplay());
  }

  public dohvatiSveObjave(): Observable<Post[]> {
    return this.http.get<Post[]>(PostService.postLink).pipe(shareReplay());
  }

  public osveziObjave(): void {
    let pretplata;
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
    })
  }

  public lajkujObjavu(id) {
    return this.http.patch<Post>(PostService.postLink + '/' + id, {}).pipe(shareReplay());
  }

  public get sveObjavePodaci(): Post[] {
    return this.sveObjave;
  }
}
