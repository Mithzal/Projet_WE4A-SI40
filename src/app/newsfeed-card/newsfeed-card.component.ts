import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-newsfeed-card',
  templateUrl: './newsfeed-card.component.html',
  styleUrls: ['./newsfeed-card.component.css']
})
export class NewsfeedCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() text: string = '';
  @Input() courseId: string = '';

}
