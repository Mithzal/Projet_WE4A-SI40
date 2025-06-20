import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {


  toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
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

  constructor() { }

  ngOnInit(): void {
  }

}
