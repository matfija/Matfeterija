import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable, EMPTY } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Izmena } from '../interfaces/izmena.model';
import { Post } from '../interfaces/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private static readonly postLink = 'http://localhost:3000/post';

  private sveObjave: Post[];

  constructor(private http: HttpClient) {}


  public kreirajObjavu(forma: FormData): Observable<Post> {
    return this.http.post<Post>(PostService.postLink, forma).pipe(shareReplay());
  }

  public dohvatiSveObjave(): Observable<Post[]> {
    return this.http.get<Post[]>(PostService.postLink).pipe(shareReplay());
  }

  public get sveObjavePodaci() {
    return this.sveObjave;
  }

  public set sveObjavePodaci(sveObjave) {
    this.sveObjave = sveObjave;
  }
}
