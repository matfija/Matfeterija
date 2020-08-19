import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Post } from '../interfaces/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private static readonly postLink = 'http://localhost:3000/post';

  private sveObjave: Observable<Post[]>;

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
    this.sveObjave = this.dohvatiSveObjave();
  }

  public get sveObjavePodaci(): Observable<Post[]> {
    return this.sveObjave;
  }
}
