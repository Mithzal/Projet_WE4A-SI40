import {Component, Input, OnInit} from '@angular/core';
import {ForumMessage} from "../../../models/forums.model";
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

  name : string = "unknown"


  constructor(private UserService : UsersService) { }

  // Méthode pour obtenir le nom de l'auteur du message
  loadAuthorName() {
    if (this.message.author) {
      this.UserService.getNameById(this.message.author).subscribe(
        (data : any) => {
          console.log(data)
          this.name = data.name || 'Unknown';
        }
      );
    }
  }




  ngOnInit(): void {
    this.loadAuthorName()
  }

  protected readonly auditTime = auditTime;
}
