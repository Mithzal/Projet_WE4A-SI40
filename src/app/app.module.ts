import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import {RouterModule} from "@angular/router";
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { RechercheCoursComponent } from './recherche-cours/recherche-cours.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { TableauDeBordComponent } from './tableau-de-bord/tableau-de-bord.component';
import { ProfileComponent } from './profile/profile.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { UserListComponent } from './user-list/user-list.component';
import { UeListComponent } from './ue-list/ue-list.component';
import { AssignUeUserComponent } from './assign-ue-user/assign-ue-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AdminPageComponent,
    HomeComponent,
    RechercheCoursComponent,
    MesCoursComponent,
    TableauDeBordComponent,
    ProfileComponent,
    CourseCardComponent,
    UserListComponent,
    UeListComponent,
    AssignUeUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
