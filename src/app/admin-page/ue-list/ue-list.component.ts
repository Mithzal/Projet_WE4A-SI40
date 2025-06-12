import { Component, Input, Output, EventEmitter } from '@angular/core';
import {UEsService} from "../../services/ues.service";
import {User} from "../../../models/user.model";
import {Ue} from "../../../models/ue.model";

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent {
  @Input() ues : Ue[] = [
  ];

  @Output() edit = new EventEmitter<string>();

  constructor(private service : UEsService) {
    this.service.getData().subscribe(data => {
      this.ues = data;
    });
    }
  deleteUe(id: string) {
    this.service.deleteUe(id).subscribe({
      next: () => console.log('Delete UE', id),
      error: (err) => console.error('Erreur lors de la suppression:', err)
    })
    console.log('Delete UE', id);
  }

  editUe(id: string) {
    this.edit.emit(id);
  }
}
