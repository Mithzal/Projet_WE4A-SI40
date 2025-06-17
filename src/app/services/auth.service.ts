import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.usersService.getToken();
  }

  /**
   * Login user with email and password
   */
  login(email: string, password: string): Observable<any> {
    return this.usersService.loginUser(email, password);
  }

  /**
   * Logout the current user
   */
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
