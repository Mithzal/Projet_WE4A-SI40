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
}