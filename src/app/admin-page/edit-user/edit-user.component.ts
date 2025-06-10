import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @Input() userId!: number;
  @Input() user: any;
  @Output() close = new EventEmitter<void>();

  userForm!: FormGroup;

  // Ajoutez ici les champs du formulaire, à remplir avec les données de l'utilisateur

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.initForm();
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      prenom: [this.user?.Prenom || ''],
      nom: [this.user?.Nom || ''],
      email: [this.user?.email || ''],
      role: [this.user?.role || '']
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    // Envoyer les modifications
    this.close.emit();
  }
}
