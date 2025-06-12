import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {UEsService} from "../../services/ues.service";
import {Ue} from "../../../models/ue.model";
import {User} from "../../../models/user.model";
import {UsersService} from "../../services/users.service";
import {FormBuilder, FormGroup} from "@angular/forms";

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


  constructor(private fb: FormBuilder, private UeService :UEsService, private UserService : UsersService ) {
    this.UserService.getTeachers().subscribe(data => {
      this.teachers = data;
    }
    )
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.ueForm = this.fb.group({
      name: [this.ue?.name || ''],
      code: [this.ue?.code || ''],
      description: [this.ue?.description || ''],
      credits: [this.ue?.credits || ''],
      teacherId: [this.ue?.instructorId || '']
    });
    console.log('Form initialized with UE data:', this.ue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ue'] && this.ue) {
      this.ue = { ...this.ue };
    }
  }
  onSubmit() {
    if (this.ueForm.valid) {
      // Récupérer les valeurs du formulaire
      const updatedUe = {
        ...this.ue,
        ...this.ueForm.value
      };

      this.UeService.updateUe(updatedUe).subscribe({
        next: (response) => {
          console.log('Utilisateur mis à jour avec succès', response);
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
