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
    return this.http.get<User>(`${this.ApiUrl}/${userId}`);
  }

  // Get headers with auth token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers() {
    return this.http.get<User[]>(this.ApiUrl);
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.ApiUrl}/${user._id}`, user);
  }

  adduser(user: User) {
    return this.http.post<User>(this.ApiUrl, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.ApiUrl}/${id}`);
  }

  assignUeToUser(userId: string, ueId: string) {
    return this.http.put<User>(`${this.ApiUrl}/enroll/${userId}/${ueId}`,{});
  }

  getTeachers() {
    return this.http.get<User[]>(`${this.ApiUrl}/teachers`);
  }

  getStudents() {
    return this.http.get<User[]>(`${this.ApiUrl}/students`);
  }

  getCourseFromUserId(id: string) {
    return this.http.get<Ue[]>(`${this.ApiUrl}/${id}/courses`);
  }

}
