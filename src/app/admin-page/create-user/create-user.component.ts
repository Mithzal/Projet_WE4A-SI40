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
    private logsService: LogsService,
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

  createLog(type: string, message: string) {
    if (!this.CurrentUser) return;
    const log = {
      type,
      message,
      userId: this.CurrentUser._id,
    };
    this.logsService.addLog(log).subscribe({
      next: (logResponse: any) => console.log('Log créé avec succès:', logResponse),
      error: (err: any) => {
        console.error('Erreur lors de la création du log:', err);
        alert('Erreur lors de la création du log : ' + (err?.message || err?.error || JSON.stringify(err)));
      }
    });
  }

  onSubmit(): void {
    if (this.ueForm.valid) {
      console.log(this.ueForm.value);
      this.service.adduser(this.ueForm.value).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès', response);
          this.createLog(
            'creation',
            `Utilisateur créé : ${this.ueForm.value.name} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
          );
          this.refresh.emit();
          this.closeForm();
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'utilisateur:', err);
          alert('Erreur lors de la création de l\'utilisateur : ' + (err?.message || err?.error || JSON.stringify(err)));
        }
      });
    } else {
      const errors: string[] = [];
      const emailCtrl = this.ueForm.get('email');
      const passwordCtrl = this.ueForm.get('password');
      if (emailCtrl && emailCtrl.invalid) {
        if (emailCtrl.errors?.['required']) {
          errors.push('L\'email est requis.');
        } else if (emailCtrl.errors?.['email']) {
          errors.push('Le format de l\'email est incorrect.');
        }
      }
      if (passwordCtrl && passwordCtrl.invalid) {
        if (passwordCtrl.errors?.['required']) {
          errors.push('Le mot de passe est requis.');
        } else if (passwordCtrl.errors?.['minlength']) {
          errors.push('Le mot de passe doit contenir au moins 6 caractères.');
        }
      }
      if (errors.length > 0) {
        alert('Erreur(s) dans le formulaire :\n' + errors.join('\n'));
      } else {
        alert('Formulaire invalide.');
      }
      console.log('Formulaire invalide');
      console.log(this.ueForm.value);
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
