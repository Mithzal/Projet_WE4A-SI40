import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from './users.service';
import { UeReturn } from '../../models/ue.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = 'http://localhost:7777/api/ues';

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) {}

  // Submit an assignment for a specific UE content
  submitAssignment(ueId: string, contentId: string, userId: string, fileId: string, fileName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assignement/submit/${ueId}/${contentId}`,
      { userId, fileId, fileName },
      { headers: this.usersService.getAuthHeaders() }
    );
  }

  /**
   * Get a user's submission for a specific assignment
   */
  getUserAssignment(ueId: string, contentId: string, userId: string): Observable<UeReturn | null> {
    return this.http.get<UeReturn>(`${this.apiUrl}/assignement/user/${ueId}/${contentId}/${userId}`,
      { headers: this.usersService.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.log('No submission found or error occurred:', error);
        // Return null instead of empty array to properly indicate no submission
        return of(null);
      })
    );
  }

  // Delete an assignment submission
  deleteAssignment(ueId: string, contentId: string, returnId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assignement/delete/${ueId}/${contentId}/${returnId}`,
      { headers: this.usersService.getAuthHeaders() }
    );
  }
}
