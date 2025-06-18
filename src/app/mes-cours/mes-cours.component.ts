import { Component, OnInit } from '@angular/core';
import { UEsService } from "../services/ues.service";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { User } from "../../models/user.model";
import { Ue } from "../../models/ue.model";

interface NewsItem {
  text: string;
  courseId: string;
}

@Component({
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {
  // Sample data
  ues: Ue[] = [];

  // Current user
  currentUser: User | null = null;

  userCourses: Ue[] = [];

  // Sample news items (would normally come from a service)
  newsItems: NewsItem[] = [
    { text: "Nouveau chapitre disponible dans Math 101", courseId: "1" },
    { text: "Examen blanc disponible pour Physics 101", courseId: "2" }
  ];

  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';

  constructor(
    private usersService: UsersService,
    private uesService: UEsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get user from auth service
    this.currentUser = this.authService.getCurrentUser();

    // If user exists, fetch their courses
    if (this.currentUser && this.currentUser._id) {
      this.fetchUserCourses();
    }

    // Subscribe to changes in the current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.fetchUserCourses();
      }
    });
  }

  // Fetch user courses from API
  fetchUserCourses(): void {
    if (this.currentUser && this.currentUser._id) {
      this.usersService.getCourseFromUserId(this.currentUser._id).subscribe({
        next: (courses) => {
          this.userCourses = courses;
        },
        error: (error) => {
          console.error('Error fetching user courses:', error);
        }
      });
    }
  }

  // Filter courses based on search term
  filterCourses(): Ue[] {
    if (!this.userCourses) return [];

    if (!this.searchTerm) return this.sortUserCourses();

    const term = this.searchTerm.toLowerCase();
    return this.userCourses.filter(ue =>
      ue.name.toLowerCase().includes(term) ||
      (ue.description && ue.description.toLowerCase().includes(term))
    ).sort((a, b) => this.sortCourses(a, b));
  }

  // Sort user courses based on selected option
  sortUserCourses(): Ue[] {
    return [...this.userCourses].sort((a, b) => this.sortCourses(a, b));
  }

  // Sort courses based on selected option
  sortCourses(a: Ue, b: Ue): number {
    if (this.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (this.sortBy === 'date') {
      // In a real app, you'd sort by last access date
      return 0;
    }
    return 0;
  }

  // Update sort method
  updateSort(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
  }

  // Method to calculate progress
  getCourseProgress(courseId: string): number {
    // In a real app, this would calculate actual progress
    return Math.floor(Math.random() * 100);
  }
}
