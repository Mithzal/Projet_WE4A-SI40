import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import {UEsService} from "../services/ues.service";
import {UsersService} from "../services/users.service";
import {User} from "../../models/user.model";
import { Ue } from "../../models/ue.model";
import { LogsService } from '../services/logs.service';

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
  editUeId: string | null = null;
  editUserId: string | null = null;
  selectedUserLogs: any[] = [];
  selectedUserName: string | null = null;

  users: User[] = [
  ];

  ues: Ue[] = [
  ];

  constructor(private UeService : UEsService, private UserService : UsersService, private logsService: LogsService ) {
    this.UserService.getAllUsers().subscribe(data =>
    this.users = data)

    this.UeService.getData().subscribe(data =>{
      this.ues = data;
    })
  }


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
    return this.users.find(u => u._id === this.editUserId!);
  }

  get editUe(): Ue | undefined {
    return this.ues.find(u => u._id === this.editUeId!);
  }

  onEditUe(id: string) {
    this.editUeId = id;
  }

  onEditUser(id: string) {
    this.editUserId = id;
  }

  onShowLogs(userId: string) {
    const user = this.users.find(u => u._id === userId);
    this.selectedUserName = user ? user.name : userId;
    this.logsService.getLogsByUser(userId).subscribe((logs: any[]) => {
      // Tri du plus récent au plus ancien
      this.selectedUserLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  }

  // Fonction générique pour rafraîchir une liste
  refreshList(type: 'ues' | 'users') {
    if (type === 'ues') {
      this.UeService.getData().subscribe(data => {
        this.ues = data;
      });
    } else if (type === 'users') {
      this.UserService.getAllUsers().subscribe(data => {
        this.users = data;
      });
    }
  }
}
