import { Component, Input, Output, EventEmitter } from '@angular/core';
import {User} from "../../../models/user.model";
import {UsersService} from "../../services/users.service";
import {Ue} from "../../../models/ue.model";


@Component({
  selector: 'app-assign-ue-user',
  templateUrl: './assign-ue-user.component.html',
  styleUrls: ['./assign-ue-user.component.css']
})
export class AssignUeUserComponent {
  @Input() users: User[] = [];
  @Input() ues: Ue[] = [];
  @Output() close = new EventEmitter<void>();

  selectedUserId: string  = '';
  selectedUeId: string = '';
  errorMessage: string = '';

  constructor(private service : UsersService) {
  }

  onSubmit() {
    this.errorMessage = '';
    this.service.assignUeToUser(this.selectedUserId, this.selectedUeId).subscribe({
      next: () => {
        this.close.emit();
      },
      error: (err) => {
        this.errorMessage = err.error.message ;
        console.log(err)

      }
    })
  }

  onCancel() {
    this.close.emit();
  }
}
