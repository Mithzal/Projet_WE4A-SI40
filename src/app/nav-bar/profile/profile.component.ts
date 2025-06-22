import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../../models/user.model";
import {Ue} from "../../../models/ue.model";
import {UsersService} from "../../services/users.service";
import {UEsService} from "../../services/ues.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public currentUser: User = this.auth.getCurrentUser()!
  public ues: Ue[] = []

  constructor(private auth: AuthService, private UserService: UsersService, private UeService: UEsService) {
    this.currentUser = this.auth.getCurrentUser()!;
    for (let course of this.currentUser.courses) {
      this.UeService.getNameById(course.courseId).subscribe(ue => {
        this.ues.push(ue)
      });
    }
  }

  OpenEditProfile(){
    const popup = document.getElementById('editProfilePopup');
    if (popup) {
      popup.style.display = 'block';
      this.closeProfilePopup()
    }
  }
  CloseEditProfilePopup() {
    const popup = document.getElementById('editProfilePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  ngOnInit(): void {
    this.CloseEditProfilePopup()


  }

  // Pour fermer la popup de profil
  closeProfilePopup() {
    const popup = document.getElementById('profilePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

}
