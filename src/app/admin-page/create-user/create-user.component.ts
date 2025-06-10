import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  ueForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ueForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.ueForm.valid) {
      console.log(this.ueForm.value);
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}