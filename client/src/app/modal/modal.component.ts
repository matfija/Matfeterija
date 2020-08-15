import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {

  @ViewChild('modalButton', { static: false })
  private modalDugme: ElementRef;
  
  @Input('modalNaslov')
  public modalNaslov: string;

  @Input('modalPoruka')
  public modalPoruka: string;

  @Input('prikaziModal')
  public prikaziModal: boolean;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.prikaziModal) {
      this.modalDugme.nativeElement.click();
    }
  }

}
