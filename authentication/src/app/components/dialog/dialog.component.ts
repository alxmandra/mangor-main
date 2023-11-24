import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';

import { ModalService } from './modalService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
export interface IDialog {
  status: string
  header: string
  body: string
  buttons: {
    label: string
    action: ()=>{}
  }
}
@Component({
  selector: 'jw-modal',
  standalone: true,
  templateUrl: 'mangor-dialog.component.html',
  styleUrls: ['mangor-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule]
})

export class MangorDialogComponent implements OnInit, OnDestroy {
  @Input() id?: string;

  isOpen = false;
  private element: any;
  @Input() bodyText = 'This text can be updated in modal 1';
  modalService: ModalService;
  @Input() header: string = 'hello text';
  @Input() footer: any[] = [];

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {
    this.element = this.el.nativeElement;
    this.modalService = inject(ModalService);
  }

  ngOnInit() {
    // add self (this modal instance) to the modal service so it can be opened from any component
    this.modalService.add(this);
    console.log('ngOnInit')
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'jw-modal') {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    // remove self from modal service
    this.modalService.remove(this);
    // remove modal element from html
    this.element.remove();
  }

  open() {
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
    this.isOpen = true;
    this.ngOnInit();
    this.cd.detectChanges();
  }

  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
    this.isOpen = false;
  }
}