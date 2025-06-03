import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent {
  @Input() ues = [
    // Sample UE data
    { id: 1, code: 'INF101' }
  ];

  deleteUe(id: number) {
    console.log('Delete UE', id);
  }

  editUe(id: number) {
    console.log('Edit UE', id);
  }
}
