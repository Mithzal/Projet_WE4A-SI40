import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';

export interface User {
  id: number;
  Prenom: string;
  Nom: string;
  email: string;
  role: string;
}

export interface Ue {
  id: number;
  code: string;
  title: string;
}

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

  users: User[] = [
    { id: 1, Prenom: 'Jean', Nom: 'Dupont', email: 'jean.dupont@example.com' , role: 'Admin' },
    { id: 2, Prenom: 'Marie', Nom: 'Curie', email: 'test@email.com', role: 'User'},
  ];

  ues: Ue[] = [
    { id: 1, code: 'INF101', title: 'Informatique 1' },
    { id: 2, code: 'INF102', title: 'Informatique 2' },
    { id: 3, code: 'INF103', title: 'Informatique 3' }
  ];

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

  get editUser(): User | undefined {
    return this.users.find(u => u.id === this.editUserId!);
  }

  get editUe(): Ue | undefined {
    return this.ues.find(u => u.id === this.editUeId!);
  }
  
  onEditUe(id: number) {
    this.editUeId = id;
  }

  onEditUser(id: number) {
    this.editUserId = id;
  }
}
