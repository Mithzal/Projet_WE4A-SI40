import {Component, Input, OnInit} from '@angular/core';
import {UeContent} from "../../../models/ue.model";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() content : UeContent = {
    type : '',
    title: '',
    text:  '',
  }

  constructor() { }

  ngOnInit(): void {
  }

}
