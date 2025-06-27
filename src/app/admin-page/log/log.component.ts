import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  messages: string[] = [];

  constructor(private logsService: LogsService) { }

  ngOnInit(): void {
    this.logsService.getAllLogs().subscribe({
      next: (logs: any[]) => {
        this.messages = logs.map(log => log.message);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des logs:', err);
      }
    });
  }
}
