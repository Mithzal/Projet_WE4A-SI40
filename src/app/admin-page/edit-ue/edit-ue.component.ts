import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {UEsService} from "../../services/ues.service";
import {Ue} from "../../../models/ue.model";
import {User} from "../../../models/user.model";
import {UsersService} from "../../services/users.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import { LogsService } from '../../services/logs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-ue',
  templateUrl: './edit-ue.component.html',
  styleUrls: ['./edit-ue.component.css']
})
export class EditUeComponent implements OnInit {
  @Input() ueId!: string;
  @Input() ue!: Ue;
  @Input() teachers : User[] = [];
  @Output() close = new EventEmitter<void>();
  ueForm!:FormGroup
  CurrentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private UeService: UEsService,
    private UserService: UsersService,
    private logsService: LogsService,
    private authService: AuthService
  ) {
    this.UserService.getTeachers().subscribe(data => {
      this.teachers = data;
      console.log('Liste des enseignants récupérée avec succès:', this.teachers);
    });
  }

  ngOnInit(): void {
    this.CurrentUser = this.authService.getCurrentUser();
    this.initForm();
  }

  initForm() {
    this.ueForm = this.fb.group({
      name: [this.ue?.name || ''],
      code: [this.ue?.code || ''],
      description: [this.ue?.description || ''],
      credits: [this.ue?.credits || ''],
      instructorId: [this.ue?.instructorId || '']
    });
    console.log('Form initialized with UE data:', this.ue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ue'] && this.ue) {
      this.ue = { ...this.ue };
    }
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

  onSubmit() {
    if (this.ueForm.valid) {
      // Récupérer les valeurs du formulaire
      console.log("ue :",this.ue)
      console.log("ueForm :",this.ueForm.value)
      const updatedUe = {
        ...this.ue,
        ...this.ueForm.value


      };
      console.log(updatedUe)

      this.UeService.updateUe(updatedUe).subscribe({
        next: (response) => {
          console.log('UE mise à jour avec succès', response);
          this.createLog(
            'update',
            `UE modifiée : ${updatedUe.code} par ${this.CurrentUser?.name} ${new Date().toLocaleString()}`
          );
          this.close.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}
