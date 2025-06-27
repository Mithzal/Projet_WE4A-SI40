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
    // Vérifie la présence de toutes les infos utilisateur dans le localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userCourses = localStorage.getItem('userCourses');
    if (userId && userName && userEmail && userRole && userCourses) {
      this.currentUserSubject.next({
        _id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
        courses: JSON.parse(userCourses),
        password: ''
      });
    } else {
      this.currentUserSubject.next(null);
    }
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
            // Store token and user info in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', response.user._id!);
            localStorage.setItem('userName', response.user.name);
            localStorage.setItem('userEmail', response.user.email);
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('userCourses', JSON.stringify(response.user.courses));
            // Update current user subject
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  // Logout user and clear session
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCourses');
    // Clear the current user
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  updateCurrentUser(user: User): void {
    // Update the current user in the BehaviorSubject
    this.currentUserSubject.next(user);
    // Update localStorage
    localStorage.setItem('userId', user._id!);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userCourses', JSON.stringify(user.courses));
  }

  // Recharge l'utilisateur courant depuis le localStorage
  refreshCurrentUser(): void {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userCourses = localStorage.getItem('userCourses');
    if (userId && userName && userEmail && userRole && userCourses) {
      this.currentUserSubject.next({
        _id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
        courses: JSON.parse(userCourses),
        password: ''
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }
}
