import {Component, Input, OnInit} from '@angular/core';
import {ForumMessage} from "../../../models/forums.model";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Input() messages: ForumMessage[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
