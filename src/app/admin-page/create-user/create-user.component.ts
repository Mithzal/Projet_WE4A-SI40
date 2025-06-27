import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  ueForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  CurrentUser: User | null = null;
  constructor(
    private fb: FormBuilder,
    private service: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.CurrentUser = this.authService.getCurrentUser();
    this.ueForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.ueForm.valid) {
      console.log(this.ueForm.value);
      this.service.adduser(this.ueForm.value).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès', response);
          this.closeForm();
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      });
    } else {
      console.log('Formulaire invalide');
      console.log(this.ueForm.value);
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
