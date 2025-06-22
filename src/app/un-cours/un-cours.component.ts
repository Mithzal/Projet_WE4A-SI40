import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UEsService} from "../services/ues.service";
import {Ue} from "../../models/ue.model";
import {AuthService} from "../services/auth.service";

interface NewsItem {
  text: string;
  courseId: string;
}

@Component({
  selector: 'app-un-cours',
  templateUrl: './un-cours.component.html',
  styleUrls: ['./un-cours.component.css']
})
export class UnCoursComponent implements OnInit {
  courseId = this.route.snapshot.paramMap.get('id');


  course: Ue = {
    name: 'Chargement du cours...',
    code: '',
    description: '',
    credits: 0,
    instructorId: '',
    content : [],
  };

  sidebarHidden = true;
  userRole = '';
  courseNewsItems: NewsItem[] = [];

  constructor(private route: ActivatedRoute, private service : UEsService, private authService : AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id');
      // Here you would fetch the course data from your API
      this.loadCourse(courseId!);
      this.loadUserRole();
      this.loadCourseNews(courseId);
    });
  }

  loadCourse(courseId: string): void {

    if (courseId) {
       this.service.getDataById(courseId).subscribe(
        (data: Ue) => {
          this.course = data;
        },
        (error) => {
          console.error('Error fetching course data:', error);
          this.course = {
            name: 'Erreur de chargement du cours',
            code: '',
            description: '',
            credits: 0,
            instructorId: '',
            content : [],
          };
        }
      )
    }
  }

  loadUserRole(): void {
   this.userRole =  this.authService.getCurrentUser()?.role!

  }

  loadCourseNews(courseId: string | null): void {
    // This would be an API call in a real app
    if (courseId) {
      this.courseNewsItems = [
        { text: 'Nouveau chapitre disponible', courseId: courseId },
        { text: 'Date d\'examen publiée', courseId: courseId }
      ];
    }
  }

  toggleSidebar(): void {
    this.sidebarHidden = !this.sidebarHidden;
  }

  isTeacherOrAdmin(): boolean {
    // Check if user is teacher or admin
    return ['ROLE_PROF', 'ROLE_PROF_ADMIN', 'ROLE_ADMIN'].includes(this.userRole);
  }
}
