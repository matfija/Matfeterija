import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private static readonly commentLink = 'http://localhost:3000/comm/';


  constructor(private http: HttpClient) {   
  }

  public dohvatiKomentar(id: string): Observable<Comment> {
    return this.http.get<Comment>(CommentService.commentLink + id).pipe(shareReplay());
  }

  public lajkujKomentar(id: string): Observable<Comment> {
    return this.http.patch<Comment>(CommentService.commentLink + id, {}).pipe(shareReplay());
  }

  public obrisiKomentar(id: string): Observable<Comment> {
    return this.http.delete<Comment>(CommentService.commentLink + id).pipe(shareReplay());
  }

}
