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
  courseCode?: string;
  contentId?: string;
  contentTitle?: string;
  date?: Date;
  type?: string;
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
  isLoadingNews: boolean = false;

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
          // Reload news with the updated course data
          this.loadCourseNews(courseId);
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
    this.isLoadingNews = true;

    // Reset news items
    this.courseNewsItems = [];

    if (!courseId || !this.course) {
      this.isLoadingNews = false;
      return;
    }

    // Extract course code for consistent display
    const courseCode = this.course.code || 'Course';

    // Check if the course has content items with dates
    if (this.course.content && this.course.content.length > 0) {
      // Filter for content items with dates and create news items
      this.course.content.forEach(content => {
        if (content.limitDate) {
          this.courseNewsItems.push({
            text: `${courseCode}: ${content.title}`,
            courseId: courseId,
            courseCode: courseCode,
            contentId: content._id,
            contentTitle: content.title,
            date: new Date(content.limitDate),
            type: content.type || 'content'
          });
        }
      });
    }

    // Sort news items by date (most recent first)
    if (this.courseNewsItems.length > 0) {
      this.courseNewsItems.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.getTime() - a.date.getTime(); // Changed to descending order (newest first)
      });
    }

    this.isLoadingNews = false;
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
