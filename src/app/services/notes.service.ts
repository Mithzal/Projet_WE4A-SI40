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

  // Get notes for a specific assignment submission
  getSubmissionGrade(assignmentId: string, studentId: string): Observable<Notes> {
    return this.http.get<Notes>(`${this.apiUrl}assignment/${assignmentId}/student/${studentId}`,
      { headers: this.usersService.getAuthHeaders() });
  }

  // Get a grade by submission ID
  getGradeBySubmissionId(submissionId: string): Observable<Notes> {
    return this.http.get<Notes>(`${this.apiUrl}submission/${submissionId}`,
      { headers: this.usersService.getAuthHeaders() });
  }

  // Create a new grade for an assignment submission
  createGrade(grade: Notes): Observable<Notes> {
    return this.http.post<Notes>(this.apiUrl, grade,
      { headers: this.usersService.getAuthHeaders() });
  }

  // Update an existing grade
  updateGrade(id: string, grade: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.apiUrl}${id}`, grade,
      { headers: this.usersService.getAuthHeaders() });
  }

  // Get all grades for a specific UE
  getNotesByUe(ueId: string): Observable<Notes[]> {
    return this.http.get<Notes[]>(`${this.apiUrl}ue/${ueId}`,
      { headers: this.usersService.getAuthHeaders() });
  }

  // Save a grade (create new or update existing)
  saveGrade(grade: Notes): Observable<Notes> {
    if (grade._id) {
      return this.updateGrade(grade._id, grade);
    } else {
      return this.createGrade(grade);
    }
  }
}
