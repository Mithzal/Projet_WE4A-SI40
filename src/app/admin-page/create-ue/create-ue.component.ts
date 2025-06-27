import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UEsService } from '../../services/ues.service';
import { User } from '../../../models/user.model';
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

  onSubmit() {
    if (this.ueForm.valid) {
      this.service.addUe(this.ueForm.value).subscribe({
        next: (response) => {
          console.log('UE créée avec succès:', response);
          this.refresh.emit();
          this.closeForm();
        },
        error: (err: any) => {
          console.error('Erreur lors de la création de l\'UE:', err);
          alert('Erreur lors de la création de l\'UE : ' + (err?.message || err?.error || JSON.stringify(err)));
        }
      });
      console.log('Valeur du formulaire UE:', this.ueForm.value);
    }
  }

  closeForm() {
    this.close.emit();
  }
}
