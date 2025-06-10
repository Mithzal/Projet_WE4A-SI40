import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  title = 'Page d\'administration';
  selectedTab: string = 'users';
  showCreateUeForm = false;
  showCreateUserForm = false;
  editUeId: number | null = null;
  editUserId: number | null = null;

  constructor() { }

  
  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.showCreateUeForm = false;
    this.showCreateUserForm = false;
    this.editUeId = null;
    this.editUserId = null;
  }

  onEditUe(id: number) {
    this.editUeId = id;
  }

  onEditUser(id: number) {
    this.editUserId = id;
  }
}
