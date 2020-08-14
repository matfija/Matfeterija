import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('settings') podesavanja: ElementRef;

  public prikaziMeni = false;

  constructor(private auth: AuthService,
              private renderer: Renderer2) {
                // Check for click outside settings menu
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(!this.podesavanja.nativeElement.contains(e.target)){
          this.prikaziMeni=false;
      }
   });
  }

  ngOnInit() {
    
  }

  odjaviSe() {
    this.auth.odjaviSe();
  }

  menjajPadajuciMeni() {
    this.prikaziMeni = !this.prikaziMeni;
  }
}
