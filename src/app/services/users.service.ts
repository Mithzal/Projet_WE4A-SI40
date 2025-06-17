import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user.model";
import {Ue} from "../../models/ue.model";
import {Observable, tap} from "rxjs";
import {loginResponse} from "../../models/loginResponse.model";

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

  loginUser(email: string, password: string): Observable<loginResponse> {
    return this.http.post<any>(`${this.ApiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('userId', response.user._id);
          }
        })
      );
  }
}

