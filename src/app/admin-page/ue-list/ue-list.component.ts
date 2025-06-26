import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UEsService } from '../../services/ues.service';
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../../models/user.model';
import { Ue } from '../../../models/ue.model';

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent {
  @Input() ues: Ue[] = [];
  @Output() edit = new EventEmitter<string>();
  CurrentUser: User | null = null;

  constructor(
    private service: UEsService,
    private logsService: LogsService,
    private authService: AuthService
  ) {
    this.CurrentUser = this.authService.getCurrentUser();
    this.service.getData().subscribe(data => {
      this.ues = data;
    });
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

  deleteUe(id: string) {
    this.service.deleteUe(id).subscribe({
      next: () => {
        console.log('Delete UE', id);
        this.createLog(
          'delete',
          `UE supprimée : ${id} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
        );
      },
      error: (err) => console.error('Erreur lors de la suppression:', err)
    });
  }

  editUe(id: string) {
    this.edit.emit(id);
  }
}
