import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() users = [
    { id: 1, Prenom: 'Jean', Nom: 'Dupont', email: 'jean.dupont@example.com' , role: 'Admin' },
    { id: 2, Prenom: 'Marie', Nom: 'Curie', email: 'test@email.com', role: 'User'},
  ];

  @Output() edit = new EventEmitter<number>();

  deleteUser(id: number) {
    console.log('Delete user', id);
  }

  editUser(id: number) {
    this.edit.emit(id);
  }
}

