import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css', './login-popup.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false; // Track authentication status
  showLoginPopup: boolean = false;  // Control login popup visibility
  returnUrl: string | null = null;  // Store the return URL
  isAdmin : boolean = false; // Track if the user is an admin

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  toggleDropdown() {
    if (this.isAuthenticated) {
      // If user is authenticated, show profile dropdown
      const dropdown = document.getElementById('profileDropdown');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
    } else {
      this.toggleLoginPopup();
    }
  }

  // Toggle login popup visibility
  toggleLoginPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }

  // Method to handle successful login
  handleLoginSuccess() {
    this.isAuthenticated = true;
    this.showLoginPopup = false;
    this.isAdmin = this.authService.getCurrentUser()?.role === 'Admin';


    // If there's a return URL, navigate to it
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
      this.returnUrl = null;
    }
  }

  // Method to handle logout
  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.isAdmin = false;

    // Close any open dropdowns or popups
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }

    this.closeProfilePopup();
    this.closeGradePopup();

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
    // Check authentication status
    this.isAuthenticated = this.authService.isAuthenticated();
    // Subscribe to query params to detect if login popup should be shown
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['showLogin'] === 'true') {
        this.showLoginPopup = true;

        // Store the return URL if provided
        if (params['returnUrl']) {
          this.returnUrl = params['returnUrl'];
        }
      }
    });
  }
}
//todo : fix la popup qui redirige vers la home page
