import { Component, OnInit } from '@angular/core';
import {Ue} from "../../models/ue.model";
import {UEsService} from "../services/ues.service";
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-recherche-cours',
  templateUrl: './recherche-cours.component.html',
  styleUrls: ['./recherche-cours.component.css']
})
export class RechercheCoursComponent implements OnInit {

  variableTitre: string = 'Recherche de Cours';
  UEs_details: Ue[] = [];
  searchText: string = '';
  sortField: string = 'name';

  constructor(private service : UEsService, private usersService: UsersService) {
    this.service.getData().subscribe(data => {
      this.UEs_details = data;
    });
  }

  ngOnInit(): void {
    // Initialize your data here, possibly from a service
  }

  get filteredUEs(): Ue[] {
    let filtered = this.UEs_details;
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(ue =>
        (ue.name && ue.name.toLowerCase().includes(search)) ||
        (ue.code && ue.code.toLowerCase().includes(search)) ||
        (ue.description && ue.description.toLowerCase().includes(search))
      );
    }
    // Tri dynamique
    if (this.sortField === 'name') {
      filtered = filtered.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (this.sortField === 'code') {
      filtered = filtered.slice().sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    }
    return filtered;
  }
}
