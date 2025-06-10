import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-ue',
  templateUrl: './edit-ue.component.html',
  styleUrls: ['./edit-ue.component.css']
})
export class EditUeComponent implements OnInit {
  @Input() ueId!: number;
  @Input() ue: any;
  @Output() close = new EventEmitter<void>();

  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ue'] && this.ue) {
      this.ue = { ...this.ue };
    }
  }
  onSubmit() {
    this.close.emit();
  }
  onClose() {
    this.close.emit();
  }
}
