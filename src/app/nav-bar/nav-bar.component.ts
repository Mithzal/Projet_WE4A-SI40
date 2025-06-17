import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false; // Track authentication status

  @ViewChild('loginComponent') loginComponent!: LoginComponent;

  constructor(private router: Router) { }

  toggleDropdown() {
    if (this.isAuthenticated) {
      // If user is authenticated, show profile dropdown
      const dropdown = document.getElementById('profileDropdown');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
    } else {

    }
  }

  // Method to handle successful login
  handleLoginSuccess() {
    this.isAuthenticated = true;
  }

  // Method to handle logout
  logout() {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated = false;

    // Close any open dropdowns or popups
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }

    this.closeProfilePopup();
    this.closeGradePopup();

    // Navigate to home page
    this.router.navigate(['/']);

    console.log('User logged out successfully');
  }

  openProfilePopup() {
    const popup = document.getElementById('profilePopup');
    if (popup) {
      popup.style.display = 'block';
    }
  }

  // Pour fermer la popup de profil
  closeProfilePopup() {
    const popup = document.getElementById('profilePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  openGradePopup() {
    const popup = document.getElementById('gradePopup');
    if (popup) {
      popup.style.display = 'block';
    }
  }

  closeGradePopup() {
    const popup = document.getElementById('gradePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  ngOnInit(): void {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }
}

