import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {User} from "../../../models/user.model";
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() users: User[] = [];

  @Output() edit = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();
  CurrentUser: User | null = null;

  constructor(
    private service: UsersService,
    private logsService: LogsService,
    private authService: AuthService
  ) {
    this.CurrentUser = this.authService.getCurrentUser();
    this.service.getAllUsers().subscribe(data =>
      this.users = data)
  }

  createLog(type: string, message: string) {
    if (!this.CurrentUser) return;
    const log = {
      type,
      message,
      userId: this.CurrentUser._id,
    };
    this.logsService.addLog(log).subscribe({
      next: (logResponse: any) => console.log('Log créé avec succès:', logResponse),
      error: (err: any) => {
        console.error('Erreur lors de la création du log:', err);
        alert('Erreur lors de la création du log : ' + (err?.message || err?.error || JSON.stringify(err)));
      }
    });
  }

  deleteUser(id: string) {
    const userToDelete = this.users.find(u => u._id === id);
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer l'utilisateur : ${userToDelete?.name || id} ?`);
    if (!confirmDelete) return;
    this.service.deleteUser(id).subscribe({
      next: () => {
        console.log('Delete user', id);
        this.createLog(
          'delete',
          `Utilisateur supprimé : ${userToDelete?.name || id} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
        );
        this.refresh.emit();
      },
      error: (err) => console.error('Erreur lors de la suppression:', err)
    });
  }

  editUser(id: string) {
    this.edit.emit(id);
  }
}

