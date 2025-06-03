import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  title = 'Page d\'administration';
  selectedTab: string = 'users';
  constructor() { }

  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
