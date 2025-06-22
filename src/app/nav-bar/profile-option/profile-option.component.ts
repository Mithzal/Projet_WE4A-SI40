import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-profile-option',
  templateUrl: './profile-option.component.html',
  styleUrls: ['./profile-option.component.css']
})
export class ProfileOptionComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User ;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
    }, );
    this.currentUser = this.authService.getCurrentUser() || new User('', '', '', []);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()!;
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
      });
    }
  }

  get f() { return this.profileForm.controls; }





  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    const userData : User = {
      _id: this.currentUser._id,
      ...this.profileForm.value
    };

    // Ne pas envoyer le mot de passe s'il est vide
    if (!userData.password) {
      delete userData.password;
    }

    this.userService.updateUser(userData)
      .subscribe({
        next: (response) => {
          // Mettre à jour les informations utilisateur dans le service d'authentification
          this.authService.updateCurrentUser(response);
          alert('Profil mis à jour avec succès');
          this.close();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du profil', error);
          alert('Erreur lors de la mise à jour du profil');
        }
      });
  }

  close() {
    const popup = document.getElementById('editProfilePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

}
