import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.css']
})
export class LogsListComponent implements OnInit {
  messages: string[] = [];
  allLogs: any[] = [];
  logTypes: string[] = [];
  selectedType: string = 'Tous';

  // Mapping des types techniques vers des noms conviviaux
  typeLabels: { [key: string]: string } = {
    'Tous': 'Tous',
    'logging': 'Connexion',
    'disconnect': 'Déconnexion',
    'post': 'Publication',
    'reading': 'Consultation',
    'homework': 'Devoir',
    'creation': 'Création',
    'delete': 'Suppression',
    'update': 'Modification',
    'assign': 'Affectation',
  };

  constructor(private logsService: LogsService) { }

  ngOnInit(): void {
    this.logsService.getAllLogs().subscribe({
      next: (logs: any[]) => {
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.allLogs = logs;
        this.logTypes = Array.from(new Set(logs.map(log => log.type).filter(type => type && type.trim() !== '')));
        this.logTypes.unshift('Tous');
        this.filterLogs();
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des logs:', err);
      }
    });
  }

  filterLogs(): void {
    if (this.selectedType === 'Tous') {
      this.messages = this.allLogs.map(log => log.message);
    } else {
      this.messages = this.allLogs.filter(log => log.type === this.selectedType).map(log => log.message);
    }
  }

  getTypeLabel(type: string): string {
    return this.typeLabels[type] || type;
  }
}
