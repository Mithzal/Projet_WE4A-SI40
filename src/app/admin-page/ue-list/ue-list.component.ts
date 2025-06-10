import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent {
  @Input() ues = [
    { id: 1, code: 'INF101' },
    { id: 2, code: 'INF102' },
    { id: 3, code: 'INF103' }
  ];

  @Output() edit = new EventEmitter<number>();

  deleteUe(id: number) {
    console.log('Delete UE', id);
  }

  editUe(id: number) {
    this.edit.emit(id);
  }
}