import { Component, OnInit } from '@angular/core';
import { UEsService } from "../services/ues.service";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { User } from "../../models/user.model";
import { Ue, UeContent } from "../../models/ue.model";

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

  // News items for the fil d'actualité
  newsItems: NewsItem[] = [];

  // Loading state for news feed
  isLoadingNews: boolean = false;

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
          this.fetchCourseContent();
        },
        error: (error) => {
          console.error('Error fetching user courses:', error);
        }
      });
    }
  }

  // Fetch content for each course to extract dated items for news feed
  fetchCourseContent(): void {
    this.isLoadingNews = true;
    this.newsItems = [];

    // Create a counter to track when all requests are complete
    let pendingRequests = this.userCourses.length;

    // If no courses, set loading to false
    if (pendingRequests === 0) {
      this.isLoadingNews = false;
      return;
    }

    // For each course, fetch its detailed content
    this.userCourses.forEach(course => {
      if (!course._id) {
        pendingRequests--;
        if (pendingRequests === 0) this.finalizeNewsFeed();
        return;
      }

      this.uesService.getDataById(course._id).subscribe({
        next: (courseDetails) => {
          // Process content with dates
          if (courseDetails && courseDetails.content) {
            this.processContentWithDates(course.code, course._id!, courseDetails.content);
          }

          // Decrement pending requests count
          pendingRequests--;
          if (pendingRequests === 0) this.finalizeNewsFeed();
        },
        error: (error) => {
          console.error(`Error fetching content for course ${course.code}:`, error);
          pendingRequests--;
          if (pendingRequests === 0) this.finalizeNewsFeed();
        }
      });
    });
  }

  // Process course content to find items with dates
  processContentWithDates(courseCode: string, courseId: string, contentItems: UeContent[]): void {
    contentItems.forEach(content => {
      if (content.limitDate) {
        // Create a news item for each content with a date
        this.newsItems.push({
          text: `${courseCode} : ${content.title}`,
          courseId: courseId,
          courseCode: courseCode,
          contentId: content._id,
          contentTitle: content.title,
          date: new Date(content.limitDate),
          type: content.type
        });
      }
    });
  }

  // Sort news feed and finish loading
  finalizeNewsFeed(): void {
    // Sort news items by date (closest first)
    this.newsItems.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.getTime() - b.date.getTime();
    });

    this.isLoadingNews = false;
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
    //return Math.floor(Math.random() * 100);
    return 1;
  }
}
