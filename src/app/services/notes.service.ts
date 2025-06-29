import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Notes } from "../../models/notes.model";
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://localhost:7777/api/notes/';

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  getNotesByStudent(id: string): Observable<Notes[]> {
    return this.http.get<Notes[]>(`${this.apiUrl}student/${id}`, { headers: this.usersService.getAuthHeaders() });
  }
}
