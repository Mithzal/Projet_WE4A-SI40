import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  ueForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  constructor(private fb: FormBuilder, private service : UsersService) { }

  ngOnInit(): void {
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
    }else{
      console.log('Formulaire invalide');
      console.log(this.ueForm.value);

    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
