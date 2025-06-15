import {Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UEsService } from "../services/ues.service";
import { UsersService } from "../services/users.service";
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
  currentUser: User = {
    _id: "68481c3d11b909893f8ff4ec",
    name: "Alice Smith",
    email: "aliceSmith@mail.com",
    role: "student",
    courses: [],
    password: "hashed_password_1",
  };

  userCourses: Ue[] = [];

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

  constructor(private usersService: UsersService) {
    this.fetchUserCourses();
    // Initialize calendar events if needed
    // this.initializeCalendar();
  }

  ngOnInit(): void {
  }

  fetchUserCourses(): void {
    this.usersService.getCourseFromUserId(this.currentUser._id!).subscribe({
      next: (data) => {
        this.userCourses = data;
        console.log('User courses fetched:', this.userCourses);
      },
      error: (err) => {
        console.error('Error fetching user courses:', err);
      }
    });
  }

  // Get recently accessed courses
  getRecentCourses(): Ue[] {
    if (!this.currentUser.courses || this.userCourses.length === 0) {
      return [];
    }
    return this.userCourses
  }

  // Get course progress
  getCourseProgress(courseId: string): number {
    // Mock function - would normally calculate actual progress
    return Math.floor(Math.random() * 100);
  }

  // Get favorite courses
  // getFavoriteCourses(): Ue[] {
  //   if (!this.currentUser.favoriteCourses || this.userCourses.length === 0) {
  //     return [];
  //   }
  //
  //   return this.userCourses
  //     .filter(enrollment =>
  //       this.currentUser.favoriteCourses?.includes(enrollment.courseId._id))
  //     .map(enrollment => enrollment.courseId);
  // }
  //
  //
  // // Initialize calendar
  // initializeCalendar(): void {
  //   // Calendar initialization code
  // }
  //
  // // Toggle favorite status
  // toggleFavorite(course: Ue): void {
  //   if (!this.currentUser.favoriteCourses) {
  //     this.currentUser.favoriteCourses = [];
  //   }
  //
  //   if (this.currentUser.favoriteCourses.includes(course._id)) {
  //     // If course is already in favorites, remove it
  //     this.currentUser.favoriteCourses = this.currentUser.favoriteCourses.filter(id => id !== course._id);
  //   } else {
  //     // If course is not in favorites, add it
  //     this.currentUser.favoriteCourses.push(course._id);
  //   }
  // }
    // Save updated favorites to server (would implement with API call)
    // For example:
    // this.usersService.updateUser(this.currentUser._id, { favoriteCourses: this.currentUser.favoriteCourses }).subscribe();
}
