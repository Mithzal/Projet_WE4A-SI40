import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() users: User[] = [];

  @Output() edit = new EventEmitter<string>();

  constructor(private service: UsersService) {
    this.service.getAllUsers().subscribe(data =>
      this.users = data)
  }

  deleteUser(id: string) {
    this.service.deleteUser(id).subscribe({
      next: () => console.log('Delete user', id),
      error: (err) => console.error('Erreur lors de la suppression:', err)
    });
  }

  editUser(id: string) {
    this.edit.emit(id);
  }
}

