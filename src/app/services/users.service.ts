import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Ue} from "../../models/ue.model";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  private ApiUrl = "http://localhost:7777/api/users";

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Get current user information
  getCurrentUser(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID found in session');
    }
    return this.http.get<User>(`${this.ApiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Check if current user is a teacher
  isUserTeacher(): boolean {
    // First check if we already stored the role in localStorage
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      return userRole === 'Teacher';
    }
    return false;
  }

  // Check if current user is an admin
  isUserAdmin(): boolean {
    // First check if we already stored the role in localStorage
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      return userRole === 'Admin';
    }
    return false;
  }

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

  getNameById(id : string){
    return this.http.get<string>(`${this.ApiUrl}/${id}/name`, { headers: this.getAuthHeaders() });
  }

  // Récupère l'ID d'une UE à partir de son code
  getUeIdByCode(code: string): Observable<any> {
    // On suppose que l'API /api/ues?code=CODE retourne l'UE correspondante
    return this.http.get<any>(`http://localhost:7777/api/ues?code=${code}`, { headers: this.getAuthHeaders() });
  }

  // Get users by UE
  getUsersByUe(ueId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.ApiUrl}/byUe/${ueId}`, { headers: this.getAuthHeaders() });
  }

  // Update the last access time for a course
  updateLastAccess(userId: string, courseId: string): Observable<any> {
    return this.http.put<any>(
      `${this.ApiUrl}/lastAccess/${userId}/${courseId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

}
