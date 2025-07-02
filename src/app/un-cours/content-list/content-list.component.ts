import {Component, Input, OnInit} from '@angular/core';
import {UeContent} from "../../../models/ue.model";

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {
  @Input() contents: UeContent[] = [];

  removeContent(contentId: string) {
    this.contents = this.contents.filter(c => c._id !== contentId);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
