import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-course-navbar',
  templateUrl: './course-navbar.component.html',
  styleUrls: ['./course-navbar.component.css']
})
export class CourseNavbarComponent {
  @Input() courseId!: number;
  @Input() userRole!: string; // <--- CE `@Input()` DOIT EXISTER

  constructor() { }

  ngOnInit(): void {
  }

}
