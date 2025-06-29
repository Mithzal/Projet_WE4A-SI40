import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ForumMessage, Forums} from "../../../models/forums.model";
import {UsersService} from "../../services/users.service";
import {auditTime} from "rxjs";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() message: ForumMessage = {
    content: '',
    type: 'message',
    timestamp: new Date(),
    author : ''
  };
  @Input() isAdminOrTeacher: boolean = false;
  @Input() forum?: Forums;
  @Input() index?: number;
  @Output() delete = new EventEmitter<number>();

  name : string = "unknown"


  constructor(private UserService : UsersService) { }

  // Méthode pour obtenir le nom de l'auteur du message
  loadAuthorName() {
    if (this.message.author) {
      this.UserService.getNameById(this.message.author).subscribe(
        (data : any) => {
          this.name = data.name || 'Unknown';
        }
      );
    }
  }

  ngOnInit(): void {
    this.loadAuthorName()
  }

  onDelete() {
    if (this.index !== undefined) {
      this.delete.emit(this.index);
    }
  }

  protected readonly auditTime = auditTime;
}
