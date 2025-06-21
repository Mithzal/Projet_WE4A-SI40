import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Ue} from "../../models/ue.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  private ApiUrl = "http://localhost:7777/api/users";

  // Get auth token
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  // Get current user information
  getCurrentUser(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID found in session');
    }
    return this.http.get<User>(`${this.ApiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Get headers with auth token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers() {
    return this.http.get<User[]>(this.ApiUrl, { headers: this.getAuthHeaders() });
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.ApiUrl}/${user._id}`, user, { headers: this.getAuthHeaders() });
  }

  adduser(user: User) {
    return this.http.post<User>(this.ApiUrl, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.ApiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  assignUeToUser(userId: string, ueId: string) {
    return this.http.put<User>(`${this.ApiUrl}/enroll/${userId}/${ueId}`, {}, { headers: this.getAuthHeaders() });
  }

  getTeachers() {
    return this.http.get<User[]>(`${this.ApiUrl}/teachers`, { headers: this.getAuthHeaders() });
  }

  getStudents() {
    return this.http.get<User[]>(`${this.ApiUrl}/students`, { headers: this.getAuthHeaders() });
  }

  getCourseFromUserId(id: string) {
    return this.http.get<Ue[]>(`${this.ApiUrl}/${id}/courses`, { headers: this.getAuthHeaders() });
  }
}
