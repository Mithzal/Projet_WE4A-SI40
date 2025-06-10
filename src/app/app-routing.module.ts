import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RechercheCoursComponent} from "./recherche-cours/recherche-cours.component";
import {AssignUeUserComponent} from './admin-page/assign-ue-user/assign-ue-user.component';
import {MesCoursComponent} from "./mes-cours/mes-cours.component";
import {TableauDeBordComponent} from "./tableau-de-bord/tableau-de-bord.component";
import {ProfileComponent} from "./profile/profile.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
import {UnCoursComponent} from "./un-cours/un-cours.component";



const routes : Routes =[
  {path :"", component : HomeComponent},
  {path :"recherche", component : RechercheCoursComponent },
  {path: 'assign-ue-user', component: AssignUeUserComponent },
  {path: "admin-page", component: AdminPageComponent},
  {path :"mes-cours", component : MesCoursComponent },
  {path :"tableau-de-bord", component : TableauDeBordComponent },
  {path :"profile", component : ProfileComponent},
  {path: "cours/:id", component: UnCoursComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
