import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() newsItems: { text: string; courseId: string }[] = [];


}
