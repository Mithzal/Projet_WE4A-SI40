import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RechercheCoursComponent} from "./recherche-cours/recherche-cours.component";
import {AssignUeUserComponent} from './admin-page/assign-ue-user/assign-ue-user.component';
import {MesCoursComponent} from "./mes-cours/mes-cours.component";
import {TableauDeBordComponent} from "./tableau-de-bord/tableau-de-bord.component";
import {ProfileComponent} from "./nav-bar/profile/profile.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
import {UnCoursComponent} from "./un-cours/un-cours.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginComponent} from "./login/login.component";



const routes : Routes =[
  {path :"", component : HomeComponent},
  {path: "login", component: LoginComponent},
  {path :"recherche", component : RechercheCoursComponent},
  {path: 'assign-ue-user', component: AssignUeUserComponent, canActivate: [AuthGuard] },
  {path: "admin-page", component: AdminPageComponent, canActivate: [AuthGuard]},
  {path :"mes-cours", component : MesCoursComponent, canActivate: [AuthGuard] },
  {path :"tableau-de-bord", component : TableauDeBordComponent, canActivate: [AuthGuard] },
  {path :"profile", component : ProfileComponent, canActivate: [AuthGuard]},
  {path: "cours/:id", component: UnCoursComponent, canActivate: [AuthGuard]},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
