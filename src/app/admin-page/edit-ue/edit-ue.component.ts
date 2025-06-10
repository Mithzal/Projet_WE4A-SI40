import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-ue',
  templateUrl: './edit-ue.component.html',
  styleUrls: ['./edit-ue.component.css']
})
export class EditUeComponent implements OnInit {
  @Input() ueId!: number;
  @Output() close = new EventEmitter<void>();

  ue = { code: '', title: '' };
  
  constructor() { }

  ngOnInit(): void {
  }

  onClose() {
    this.close.emit();
  }
}
