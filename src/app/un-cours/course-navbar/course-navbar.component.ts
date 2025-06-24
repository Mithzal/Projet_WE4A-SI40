import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-course-navbar',
  templateUrl: './course-navbar.component.html',
  styleUrls: ['./course-navbar.component.css']
})
export class CourseNavbarComponent {
  @Input() courseId!: string;
  @Input() userRole!: string; // <--- CE `@Input()` DOIT EXISTER
  @Output() showForumsEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleForums() {
    this.showForumsEvent.emit(true);
  }
}
