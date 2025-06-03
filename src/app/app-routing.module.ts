import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RechercheCoursComponent} from "./recherche-cours/recherche-cours.component";


const routes : Routes =[
  {path :"", component : HomeComponent},
  {path :"recherche", component : RechercheCoursComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
