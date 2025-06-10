  import { Component, Output, EventEmitter,OnInit } from '@angular/core';
  import { FormBuilder, FormGroup } from '@angular/forms';

  @Component({
    selector: 'app-create-ue',
    templateUrl: './create-ue.component.html',
    styleUrls: ['./create-ue.component.css']
  })
  export class CreateUeComponent {
    ueForm: FormGroup;

    @Output() close = new EventEmitter<void>();

    constructor(private fb: FormBuilder) {
      this.ueForm = this.fb.group({
        nom: [''],
        code: ['']
      });
    }

    onSubmit() {
      if (this.ueForm.valid) {
        // Appel à l'API ou autre logique
        console.log(this.ueForm.value);
      }
    }

    closeForm() {
      this.close.emit();
    }
  }