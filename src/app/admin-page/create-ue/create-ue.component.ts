  import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
  import {FormBuilder, FormGroup, Validators} from '@angular/forms';
  import {UsersService} from "../../services/users.service";
  import {UEsService} from "../../services/ues.service";
  import {User} from "../../../models/user.model";

  @Component({
    selector: 'app-create-ue',
    templateUrl: './create-ue.component.html',
    styleUrls: ['./create-ue.component.css']
  })
  export class CreateUeComponent {
    ueForm!: FormGroup;
    @Input() teachers : User[] = [];

    @Output() close = new EventEmitter<void>();

    constructor(private fb: FormBuilder, private service: UEsService, private UserSrvice : UsersService) {
      this.UserSrvice.getTeachers().subscribe(data =>{
        this.teachers = data;
      })
    }
    log(){

    }

    ngOnInit() {
      this.ueForm = this.fb.group({
        code: ['', Validators.required],
        name: ['',Validators.required],
        description: ['', Validators.required],
        credits: ['', [Validators.required, Validators.min(1)]],
        instructorId: ['', Validators.required]
      });
    }
    onSubmit() {
      if (this.ueForm.valid) {
        this.service.addUe(this.ueForm.value).subscribe({
          next: (response) => {
            console.log('UE créée avec succès', response);
            this.closeForm();
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'UE', error);
          }
        });
        console.log(this.ueForm.value);
      }
    }

    closeForm() {
      this.close.emit();
    }
  }
