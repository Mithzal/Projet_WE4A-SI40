import {Component, Input, OnInit} from '@angular/core';
import {ForumMessage} from "../../../models/forums.model";

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


  constructor() { }

  ngOnInit(): void {
  }

}
