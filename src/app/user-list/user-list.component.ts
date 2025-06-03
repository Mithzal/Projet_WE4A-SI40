import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() users = [
    // Sample user data, should be replaced with actual service call
    { id: 1, Prenom: 'Jean', Nom: 'Dupont', email: 'jean.dupont@example.com' }
  ];

  deleteUser(id: number) {
    console.log('Delete user', id);
  }

  editUser(id: number) {
    console.log('Edit user', id);
  }
}

