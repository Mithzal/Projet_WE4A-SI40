import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  course: any = {
    id: '',
    titre: 'Chargement du cours...'
  };

  sidebarHidden = true;
  userRole = '';
  courseNewsItems: NewsItem[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id');
      // Here you would fetch the course data from your API
      this.loadCourse(courseId);
      this.loadUserRole();
      this.loadCourseNews(courseId);
    });
  }

  loadCourse(courseId: string | null): void {
    // This is where you would make an API call to get the course details
    // For now, using mock data
    if (courseId) {
      this.course = {
        id: courseId,
        titre: 'Exemple de cours ' + courseId
      };
    }
  }

  loadUserRole(): void {
    // Simulate getting the user role from an auth service
    // You would implement this properly with your auth service
    this.userRole = 'ROLE_PROF'; // Example role
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
