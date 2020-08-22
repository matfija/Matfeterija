import { Component, OnInit, ViewChild, ElementRef, Input,
  OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {

  @ViewChild('modalButton', { static: false })
  private modalDugme: ElementRef;

  @Input()
  public modalNaslov: string;

  @Input()
  public modalPoruka: string;

  @Input()
  public prikaziModal: boolean;

  @Output() 
  public prikaziModalChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.prikaziModal) {
      this.modalDugme.nativeElement.click();
    }
  }

  // Resetovanje promenljive prikazi modal
  zatvoriModal() {
    // setTimeOut da bi izbegli ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
    this.prikaziModalChange.emit('false');
    })
  }

}
