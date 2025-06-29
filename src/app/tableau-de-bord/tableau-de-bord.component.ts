import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UEsService } from "../services/ues.service";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { User } from "../../models/user.model";
import { Ue } from "../../models/ue.model";

interface CalendarEvent {
  _id: string;
  title: string;
  date: Date;
  courseCode: string;
  type: 'assignment' | 'exam' | 'lecture';
}

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {
  currentUser: User | null = null;
  userCourses: Ue[] = [];
  recentCourses: Ue[] = []; // Add a separate array for recent courses sorted by lastAccess

  // Calendar events
  calendarEvents: CalendarEvent[] = [
    {
      _id: "1",
      title: "Math 101 Exam",
      date: new Date('2023-12-15'),
      courseCode: "MT01",
      type: "exam"
    },
    {
      _id: "2",
      title: "Physics Assignment Due",
      date: new Date('2023-12-10'),
      courseCode: "PS02",
      type: "assignment"
    }
  ];

  constructor(
    private usersService: UsersService,
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

  fetchUserCourses(): void {
    if (this.currentUser && this.currentUser._id) {
      this.usersService.getCourseFromUserId(this.currentUser._id).subscribe({
        next: (courses) => {
          this.userCourses = courses;
          // Sort the recent courses immediately when we get the data
          this.updateRecentCourses();
        },
        error: (error) => {
          console.error('Error fetching user courses:', error);
        }
      });
    }
  }

  // Update the recent courses list sorted by lastAccess date
  updateRecentCourses(): void {
    // Filter courses that have been accessed at least once
    const accessedCourses = this.userCourses.filter(course => course.lastAccess);

    // Sort courses by lastAccess date (most recent first)
    this.recentCourses = accessedCourses.sort((a, b) => {
      if (!a.lastAccess) return 1;
      if (!b.lastAccess) return -1;

      // Convert string dates to Date objects if needed
      const dateA = a.lastAccess instanceof Date ? a.lastAccess : new Date(a.lastAccess);
      const dateB = b.lastAccess instanceof Date ? b.lastAccess : new Date(b.lastAccess);

      // Sort in descending order (most recent first)
      return dateB.getTime() - dateA.getTime();
    });
  }

  // Get recently accessed courses
  getRecentCourses(): Ue[] {
    return this.recentCourses;
  }

  // Get course progress
  getCourseProgress(courseId: string): number {
    // Mock function - would normally calculate actual progress
    return Math.floor(Math.random() * 100);
  }
}
