import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ForumMessage, Forums} from "../../../models/forums.model";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Input() messages: ForumMessage[] = [];
  @Input() isAdminOrTeacher: boolean = false;
  @Input() forum?: Forums;
  @Output() deleteMessage = new EventEmitter<number>(); // index of message

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteMessage(index: number) {
    this.deleteMessage.emit(index);
  }
}
