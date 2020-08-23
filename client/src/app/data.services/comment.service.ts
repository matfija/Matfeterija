import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Comm } from '../interfaces/comm.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private static readonly commentLink = 'http://localhost:3000/comm/';


  constructor(private http: HttpClient) {
  }

  public dohvatiKomentar(id: string): Observable<Comm> {
    return this.http.get<Comm>(CommentService.commentLink + id).pipe(shareReplay());
  }

  public lajkujKomentar(id: string): Observable<Comm> {
    return this.http.patch<Comm>(CommentService.commentLink + id, {}).pipe(shareReplay());
  }

  public obrisiKomentar(id: string): Observable<Comm> {
    return this.http.delete<Comm>(CommentService.commentLink + id).pipe(shareReplay());
  }

}
