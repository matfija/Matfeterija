import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../data.services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @ViewChild('container', { static: true })
  private kontejner: ElementRef;


  constructor(private renderer: Renderer2,
              private auth: AuthService) {
  }

  ngOnInit() {
    // Sakrivanje kontejnera ako stranica nije ucitana
    if (document.readyState !== 'complete') {
      this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '0');

      // Fade-in efekat po ucitavanju prozora
      window.onload = () => {
        this.renderer.setStyle(this.kontejner.nativeElement, 'opacity', '1');
      };
    }
  }

}
