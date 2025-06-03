import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { RechercheCoursComponent } from './recherche-cours/recherche-cours.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { TableauDeBordComponent } from './tableau-de-bord/tableau-de-bord.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    RechercheCoursComponent,
    MesCoursComponent,
    TableauDeBordComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
