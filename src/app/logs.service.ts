import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LogsService {
  private apiUrl = 'http://localhost:3000/logs'; // Adapter l’URL si besoin

  constructor(private http: HttpClient) {}

  addLog(log: any): Observable<any> {
    return this.http.post(this.apiUrl, log);
  }
}