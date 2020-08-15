import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { get } from 'scriptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('settings', { static: false }) podesavanja: ElementRef;

  public prikaziMeni = false;

  constructor(private auth: AuthService,
              private renderer: Renderer2,
              private router: Router) {
                // Check for click outside settings menu
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(!this.podesavanja.nativeElement.contains(e.target)){
          this.prikaziMeni=false;
      }
   });
  }

  ngOnInit() {
    get("https://kit.fontawesome.com/c059048980.js", () => {
        //FontAwesome library has been loaded...
    });
  }

  odjaviSe() {
    this.auth.odjaviSe();
    this.router.navigate(['/']);
  }

  menjajPadajuciMeni() {
    this.prikaziMeni = !this.prikaziMeni;
  }

  idiNaPodesavanja() {
    this.router.navigate(['/podesavanja']);
  }
}
