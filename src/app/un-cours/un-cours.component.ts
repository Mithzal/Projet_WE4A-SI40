import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UEsService} from "../services/ues.service";
import {Ue} from "../../models/ue.model";
import {AuthService} from "../services/auth.service";
import { UsersService } from '../services/users.service';
import { User } from '../../models/user.model';

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
    _id : this.courseId || '',
    name: 'Chargement du cours...',
    code: '',
    description: '',
    credits: 0,
    instructorId: '',
    content : [],
  };

  sidebarHidden = true;
  userRole = '';
  showForums = false; // Variable pour contrôler l'affichage du forum
  courseNewsItems: NewsItem[] = [];
  showCourse = true;
  showParticipants = false;
  participants: User[] = [];
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: UEsService,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.usersService.getCurrentUserId();

    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id');
      if (courseId) {
        this.service.consultUe(courseId).subscribe({
          next: () => {},
          error: (err) => { console.error('Erreur log consultation UE:', err); }
        });

        // Update the last access timestamp for this course
        this.updateLastAccessTimestamp(courseId);
      }
      this.loadCourse(courseId!);
      this.loadUserRole();
      this.loadCourseNews(courseId);
    });
  }

  // New method to update the lastAccess timestamp
  private updateLastAccessTimestamp(courseId: string): void {
    if (this.currentUserId) {
      this.usersService.updateLastAccess(this.currentUserId, courseId).subscribe({
        next: () => {
          console.log('Last access timestamp updated');
        },
        error: (err) => {
          console.error('Error updating last access timestamp:', err);
        }
      });
    }
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

  isTeacherOrAdmin(): boolean {
    // Check if user is teacher or admin
    return ['Teacher', 'Admin'].includes(this.userRole);
  }

  // Méthode pour afficher les forums
  onShowForums(show: boolean) {
    this.showForums = show;
    this.showCourse = !show;
    this.showParticipants = false;
  }

  onShowCourse(show: boolean) {
    this.showCourse = show;
    this.showForums = !show;
    this.showParticipants = false;
  }

  onShowParticipants(show: boolean) {
    this.showParticipants = show;
    this.showCourse = !show;
    this.showForums = false;
    if (show && this.courseId) {
      this.usersService.getUsersByUe(this.courseId).subscribe({
        next: (users) => this.participants = users,
        error: () => this.participants = []
      });
    }
  }
}
