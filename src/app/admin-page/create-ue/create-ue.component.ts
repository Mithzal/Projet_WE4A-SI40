import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UEsService } from '../../services/ues.service';
import { User } from '../../../models/user.model';
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-ue',
  templateUrl: './create-ue.component.html',
  styleUrls: ['./create-ue.component.css']
})
export class CreateUeComponent implements OnInit {
  ueForm!: FormGroup;
  CurrentUser: User | null = null;
  @Input() teachers: User[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private service: UEsService,
    private UserService: UsersService,
    private logsService: LogsService,
    private authService: AuthService
  ) {
    this.UserService.getTeachers().subscribe(data => {
      this.teachers = data;
    });
  }

  ngOnInit() {
    this.CurrentUser = this.authService.getCurrentUser();
    this.ueForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      credits: ['', [Validators.required, Validators.min(1)]],
      instructorId: ['', Validators.required]
    });
  }

  createLog(type: string, message: string) {
    if (!this.CurrentUser) return;
    const log = {
      type,
      message,
      userId: this.CurrentUser._id,
    };
    console.log('Log envoyé:', log);
    this.logsService.addLog(log).subscribe({
      next: (logResponse: any) => console.log('Log créé avec succès:', logResponse),
      error: (err: any) => {
        console.error('Erreur lors de la création du log:', err);
        alert('Erreur lors de la création du log : ' + (err?.message || err?.error || JSON.stringify(err)));
      }
    });
  }

  onSubmit() {
    if (this.ueForm.valid) {
      this.service.addUe(this.ueForm.value).subscribe({
        next: (response) => {
          console.log('Réponse création UE:', response);
          // Debug localStorage user
          console.log('localStorage user:', localStorage.getItem('user'));
          console.log('userId récupéré:', this.CurrentUser?._id);
          // Création du log après succès
          this.createLog(
            'creation',
            `UE créée ${response.code} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
          );
          this.refresh.emit();
          this.closeForm();
        },
        error: (err: any) => {
          console.error('Erreur lors de la création de l\'UE:', err);
          let errorMsg = 'Erreur lors de la création de l\'UE.';
          // Si l'API retourne des erreurs de validation par champ
          if (err?.error) {
            if (typeof err.error === 'object') {
              // Cas d'un objet d'erreurs par champ
              errorMsg += '\n';
              for (const key in err.error) {
                if (err.error.hasOwnProperty(key)) {
                  errorMsg += `Champ "${key}" : ${err.error[key]}\n`;
                }
              }
            } else if (typeof err.error === 'string') {
              // Cas d'un message d'erreur simple
              errorMsg += `\n${err.error}`;
            }
          } else if (err?.message) {
            errorMsg += `\n${err.message}`;
          }
          alert(errorMsg);
        }
      });
      console.log('Valeur du formulaire UE:', this.ueForm.value);
    } else {
      // Affichage des champs invalides côté client
      const invalid = Object.keys(this.ueForm.controls).filter(key => this.ueForm.get(key)?.invalid);
      let errorMsg = 'Champs invalides : ' + invalid.join(', ');
      alert(errorMsg);
    }
  }

  closeForm() {
    this.close.emit();
  }
}
