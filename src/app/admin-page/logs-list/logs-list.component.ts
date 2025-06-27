import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.css']
})
export class LogsListComponent implements OnInit {
  messages: string[] = [];

  constructor(private logsService: LogsService) { }

  ngOnInit(): void {
    this.logsService.getAllLogs().subscribe({
      next: (logs: any[]) => {
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.messages = logs.map(log => log.message);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des logs:', err);
      }
    });
  }
}
