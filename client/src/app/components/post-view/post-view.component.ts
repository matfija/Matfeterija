import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from "@angular/common";
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  @Input()
  public korisnik;

  @Input()
  public objava;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public formatirajDatum() {
    return formatDate(new Date(this.objava.date), "dd/MM/yy hh:mm", "en_US")
  }

  idiNaProfil(alas: any) {
    this.router.navigate(['/profil', { alas }]);
  }
}
