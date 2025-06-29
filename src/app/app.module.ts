import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { RechercheCoursComponent } from './recherche-cours/recherche-cours.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { TableauDeBordComponent } from './tableau-de-bord/tableau-de-bord.component';
import { ProfileComponent } from './nav-bar/profile/profile.component';
import { CourseCardComponent } from './un-cours/course-card/course-card.component';
import { UserListComponent } from './admin-page/user-list/user-list.component';
import { UeListComponent } from './admin-page/ue-list/ue-list.component';
import { AssignUeUserComponent } from './admin-page/assign-ue-user/assign-ue-user.component';
import { CreateUserComponent } from './admin-page/create-user/create-user.component';
import { CreateUeComponent } from './admin-page/create-ue/create-ue.component';
import { EditUserComponent } from './admin-page/edit-user/edit-user.component';
import { EditUeComponent } from './admin-page/edit-ue/edit-ue.component';
import { NewsfeedComponent } from './mes-cours/newsfeed/newsfeed.component';
import { NewsfeedCardComponent } from './mes-cours/newsfeed-card/newsfeed-card.component';
import { UnCoursComponent } from './un-cours/un-cours.component';
import {HttpClientModule} from "@angular/common/http";
import { FileComponent } from './file/file.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileOptionComponent } from './nav-bar/profile-option/profile-option.component';
import { GradePopupComponent } from './nav-bar/grade-popup/grade-popup.component';
import { CourseNavbarComponent } from './un-cours/course-navbar/course-navbar.component';
import { PostComponent } from './post/post.component';
import { CourseSidebarComponent } from './un-cours/course-sidebar/course-sidebar.component';
import { ForumsComponent } from './forums/forums.component';
import { MessagesComponent } from './forums/messages/messages.component';
import { AddMessageComponent } from './forums/add-message/add-message.component';
import { MessageListComponent } from './forums/message-list/message-list.component';
import { CourseDetailsComponent } from './un-cours/course-details/course-details.component';
import { LogsListComponent } from './admin-page/logs-list/logs-list.component';
import { LogComponent } from './admin-page/log/log.component';
import { ContentListComponent } from './un-cours/content-list/content-list.component';
import { ContentComponent } from './un-cours/content/content.component';
import { AddContentComponent } from './un-cours/add-content/add-content.component';

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
    AssignUeUserComponent,
    CreateUserComponent,
    CreateUeComponent,
    EditUserComponent,
    EditUeComponent,
    NewsfeedComponent,
    NewsfeedCardComponent,
    UnCoursComponent,
    FileComponent,
    LoginComponent,
    AuthComponent,
    ProfileOptionComponent,
    GradePopupComponent,
    CourseNavbarComponent,
    PostComponent,
    CourseSidebarComponent,
    ForumsComponent,
    MessagesComponent,
    AddMessageComponent,
    MessageListComponent,
    CourseDetailsComponent,
    LogsListComponent,
    LogComponent,
    ContentListComponent,
    ContentComponent,
    AddContentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
