import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnInit {

  @Input() name!: string;
  @Input() code!: string;
  @Input() imageUrl!: string;
  @Input() courseUrl!: string;
  @Input() progression!: number;
  @Input() nomimg!: string;
  constructor() { }

  ngOnInit(): void {
    this.progression = 1
  }

}
