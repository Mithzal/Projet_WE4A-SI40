import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recherche-cours',
  templateUrl: './recherche-cours.component.html',
  styleUrls: ['./recherche-cours.component.css']
})
export class RechercheCoursComponent implements OnInit {
  variableTitre: string = 'Recherche de Cours';
  UEs_details: any[] = [];
  teachersByCourse: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize your data here, possibly from a service
  }

  getTeachersByCourse(courseId: number): string {
    const courseTeacher = this.teachersByCourse.find(teacher => teacher.course_id === courseId);
    return courseTeacher ? courseTeacher.teachers : '';
  }
}
