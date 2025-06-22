import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import {loginResponse} from "../../models/loginResponse.model";
import { User } from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private usersService: UsersService,
    private http: HttpClient
) {
    // Load user from session storage if available
    this.currentUserSubject.next({
      _id: sessionStorage.getItem('userId')!,
      name: sessionStorage.getItem('userName')!,
      email: sessionStorage.getItem('userEmail')!,
      role: sessionStorage.getItem('userRole')!,
      courses: sessionStorage.getItem('userCourses') ? JSON.parse(sessionStorage.getItem('userCourses')!) : [],
      password: ''
    });
  }

  private ApiUrl = "http://localhost:7777/api/users";

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.usersService.getToken();
  }

  // Login user with email and password
  login(email: string, password: string): Observable<loginResponse> {
    return this.http.post<loginResponse>(`${this.ApiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            // Store token and user ID
            sessionStorage.setItem('authToken', response.token);

            // Update current user subject
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  // Logout user and clear session
  logout(): void {
    sessionStorage.removeItem('authToken');

    // Clear the current user
    this.currentUserSubject.next(null);

    this.router.navigate(['/']);
  }

  updateCurrentUser(user: User): void {
    // Update the current user in the BehaviorSubject
    this.currentUserSubject.next(user);

    // Update session storage
    sessionStorage.setItem('userId', user._id!);
    sessionStorage.setItem('userName', user.name);
    sessionStorage.setItem('userEmail', user.email);
    sessionStorage.setItem('userRole', user.role);
    sessionStorage.setItem('userCourses', JSON.stringify(user.courses));
  }
}
