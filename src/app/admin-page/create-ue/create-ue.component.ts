import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UEsService } from '../../services/ues.service';
import { User } from '../../../models/user.model';
import { LogsService } from '../../logs.service';

@Component({
  selector: 'app-create-ue',
  templateUrl: './create-ue.component.html',
  styleUrls: ['./create-ue.component.css']
})
export class CreateUeComponent implements OnInit {
  ueForm!: FormGroup;
  @Input() teachers: User[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private service: UEsService,
    private UserService: UsersService,
    private logsService: LogsService
  ) {
    this.UserService.getTeachers().subscribe(data => {
      this.teachers = data;
    });
  }

  ngOnInit() {
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
          // Création du log après succès
          const log = {
            type: 'creation',
            message: `UE créée ${response.code} ${new Date().toLocaleString()}`,
            userId: JSON.parse(localStorage.getItem('user') || '{}').id,
          };
          this.logsService.addLog(log).subscribe();
          this.closeForm();
        }
      });
      console.log(this.ueForm.value);
    }
  }

  closeForm() {
    this.close.emit();
  }
}
