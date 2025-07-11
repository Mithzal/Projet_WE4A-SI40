import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import {UsersService} from "./users.service";


@Injectable({ providedIn: 'root' })
export class LogsService {
  private apiUrl = 'http://localhost:7777/api/logs'; // Correction du chemin de l'API

  constructor(private http: HttpClient, private usersService: UsersService) {}

  private getAuthHeaders() : HttpHeaders {
      const token = this.usersService.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }
  

  addLog(log: any): Observable<any> {
    return this.http.post(this.apiUrl, log, {headers:this.getAuthHeaders()});
  }

  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getLogsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`, { headers: this.getAuthHeaders() });
  }

  // Ajoute un log de consultation d'UE côté serveur
  logUeConsultation(ueId: string): Observable<any> {
    return this.http.post('http://localhost:7777/api/ues/consult/' + ueId, {}, { headers: this.getAuthHeaders() });
  }
}