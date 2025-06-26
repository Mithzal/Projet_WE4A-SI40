import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UsersService} from "../../services/users.service";
import {User} from "../../../models/user.model";
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @Input() userId!: string;
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  userForm!: FormGroup;
  CurrentUser: User | null = null;
  private isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: UsersService,
    private logsService: LogsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.CurrentUser = this.authService.getCurrentUser();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.initForm();
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [this.user?.name || ''],
      email: [this.user?.email || ''],
      role: [this.user?.role || '']
    });
    console.log('Form initialized with user data:', this.user)
    console.log('user role : ', this.user.role);
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

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      // Récupérer les valeurs du formulaire
      const updatedUser = {
        ...this.user,
        ...this.userForm.value
      };

      this.service.updateUser(updatedUser).subscribe({
        next: (response) => {
          console.log('Utilisateur mis à jour avec succès', response);
          this.createLog(
            'update',
            `Utilisateur modifié : ${updatedUser.name} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
          );
          this.isSubmitting = false;
          this.close.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

}
