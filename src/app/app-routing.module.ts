import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RechercheCoursComponent} from "./recherche-cours/recherche-cours.component";
import {MesCoursComponent} from "./mes-cours/mes-cours.component";
import {TableauDeBordComponent} from "./tableau-de-bord/tableau-de-bord.component";
import {ProfileComponent} from "./profile/profile.component";


const routes : Routes =[
  {path :"", component : HomeComponent},
  {path :"recherche", component : RechercheCoursComponent },
  {path :"mes-cours", component : MesCoursComponent },
  {path :"tableau-de-bord", component : TableauDeBordComponent },
  {path :"profile", component : ProfileComponent},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
