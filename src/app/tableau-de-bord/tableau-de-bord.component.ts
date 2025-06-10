import { Component, OnInit } from '@angular/core';

// Interfaces based on the provided sample data
interface UE {
  id: string;
  name: string;
  description: string;
  credits: number;
  instructorId: string;
  image?: string;
  lastAccessed?: Date;
  progress?: number;
  isFavorite?: boolean;
}

interface CourseEnrollment {
  courseId: string;
  enrollmentDate: string;
  lastAccessed?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: CourseEnrollment[];
  password: string;
  favoriteCourses?: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  courseId: string;
  type: 'assignment' | 'exam' | 'lecture';
}

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {
  // Sample data (would normally come from a service)
  ues: UE[] = [
    {
      id: "1",
      name: "Math 101",
      description: "An introductory course to mathematics.",
      credits: 3,
      instructorId: "instructor-123",
      image: "/uploads/images/math.jpg",
      lastAccessed: new Date('2023-11-10'),
      progress: 45,
      isFavorite: true
    },
    {
      id: "2",
      name: "Physics 101",
      description: "An introductory course to physics.",
      credits: 4,
      instructorId: "instructor-456",
      image: "/uploads/images/exemple-image.jpg",
      lastAccessed: new Date('2023-11-05'),
      progress: 30,
      isFavorite: false
    }
  ];

  users: User[] = [
    {
      id: "1",
      name: "Alice Smith",
      email: "aliceSmith@mail.com",
      role: "student",
      courses: [
        {
          courseId: "1",
          enrollmentDate: "2023-09-01",
          lastAccessed: new Date('2023-11-10')
        },
        {
          courseId: "2",
          enrollmentDate: "2023-09-15",
          lastAccessed: new Date('2023-11-05')
        }
      ],
      password: "hashed_password_1",
      favoriteCourses: ["1"]
    }
  ];

  // Calendar events
  calendarEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Math 101 Exam",
      date: new Date('2023-12-15'),
      courseId: "1",
      type: "exam"
    },
    {
      id: "2",
      title: "Physics Assignment Due",
      date: new Date('2023-12-10'),
      courseId: "2",
      type: "assignment"
    }
  ];

  // Current user
  currentUser: User = this.users[0];

  constructor() { }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  // Get recently accessed courses
  getRecentCourses(): UE[] {
    if (!this.currentUser) return [];

    const userCourses = this.currentUser.courses;
    // Sort by last accessed date (most recent first)
    userCourses.sort((a, b) => {
      if (!a.lastAccessed || !b.lastAccessed) return 0;
      return b.lastAccessed.getTime() - a.lastAccessed.getTime();
    });

    // Get the 3 most recently accessed courses
    const recentCourseIds = userCourses.slice(0, 3).map(c => c.courseId);

    return this.ues.filter(ue => recentCourseIds.includes(ue.id));
  }

  // Get favorite courses
  getFavoriteCourses(): UE[] {
    if (!this.currentUser || !this.currentUser.favoriteCourses) return [];

    return this.ues.filter(ue =>
      this.currentUser.favoriteCourses?.includes(ue.id)
    );
  }

  // Get course progress
  getCourseProgress(courseId: string): number {
    const course = this.ues.find(ue => ue.id === courseId);
    return course?.progress || 0;
  }

  // Initialize calendar
  initializeCalendar(): void {
    // This would integrate with a calendar library
    console.log('Calendar initialized with events:', this.calendarEvents);
  }

  // Toggle favorite status
  toggleFavorite(course: UE): void {
    course.isFavorite = !course.isFavorite;

    if (!this.currentUser.favoriteCourses) {
      this.currentUser.favoriteCourses = [];
    }

    if (course.isFavorite) {
      this.currentUser.favoriteCourses.push(course.id);
    } else {
      this.currentUser.favoriteCourses = this.currentUser.favoriteCourses.filter(id => id !== course.id);
    }
  }
}
