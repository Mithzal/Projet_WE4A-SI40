import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User, Ue } from '../admin-page.component';

@Component({
  selector: 'app-assign-ue-user',
  templateUrl: './assign-ue-user.component.html',
  styleUrls: ['./assign-ue-user.component.css']
})
export class AssignUeUserComponent {
  @Input() users: User[] = [];
  @Input() ues: Ue[] = [];
  @Output() close = new EventEmitter<void>();

  selectedUserId: number | null = null;
  selectedUeId: number | null = null;

  onSubmit() {
    alert(`Utilisateur ID: ${this.selectedUserId}, UE ID: ${this.selectedUeId}`);
  }

  onCancel() {
    this.close.emit();
  }
}