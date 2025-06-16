import { Component, OnInit } from '@angular/core';
import {UEsService} from "../services/ues.service";
import {Ue} from "../../models/ue.model";


interface CourseEnrollment {
  courseId: string;
  enrollmentDate: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: CourseEnrollment[];
  password: string;
}

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
  // Sample data (would normally come from a service)
  ues: Ue[] = [
  ];

  users: User[] = [
    {
      id: "1",
      name: "Alice Smith",
      email: "aliceSmith@mail.com",
      role: "student",
      courses: [
        {
          courseId: "1", // Changed to match UE ids
          enrollmentDate: "2023-09-01"
        },
        {
          courseId: "2", // Changed to match UE ids
          enrollmentDate: "2023-09-15"
        }
      ],
      password: "hashed_password_1"
    }
  ];

  // Sample news items
  newsItems: NewsItem[] = [
    { text: "Nouveau chapitre disponible dans Math 101", courseId: "1" },
    { text: "Examen blanc disponible pour Physics 101", courseId: "2" }
  ];

  // Current user (in a real app, this would come from an auth service)
  currentUser: User = this.users[0]; // Default to first user (Alice)

  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';

  constructor(private UeService : UEsService) {
    this.UeService.getData().subscribe(data =>{
      this.ues = data;
    })
  }

  ngOnInit(): void {
  }

  // Get the user's enrolled courses
  getUserCourses(): Ue[] {
    if (!this.currentUser) return [];

    // Get the IDs of courses the user is enrolled in
    const enrolledCourseIds = this.currentUser.courses.map(c => c.courseId);

    // Filter UEs to only include those the user is enrolled in
    return this.ues.filter(ue => enrolledCourseIds.includes(ue._id!))
      .sort((a, b) => this.sortCourses(a, b));
  }

  // Filter courses based on search term
  filterCourses(): Ue[] {
    const userCourses = this.getUserCourses();

    if (!this.searchTerm) return userCourses;

    const term = this.searchTerm.toLowerCase();
    return userCourses.filter(ue =>
      ue.name.toLowerCase().includes(term) ||
      ue.description.toLowerCase().includes(term)
    );
  }

  // Sort courses based on selected option
  sortCourses(a: Ue, b: Ue): number {
    if (this.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (this.sortBy === 'date') {
      // In a real app, you'd sort by last access date
      // For now, we'll use the enrollment date
      const aEnrollment = this.currentUser.courses.find(c => c.courseId === a._id);
      const bEnrollment = this.currentUser.courses.find(c => c.courseId === b._id);

      if (!aEnrollment || !bEnrollment) return 0;

      return new Date(bEnrollment.enrollmentDate).getTime() -
             new Date(aEnrollment.enrollmentDate).getTime();
    }
    return 0;
  }

  // Update sort method
  updateSort(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
  }

  // Method to calculate progress (placeholder)
  getCourseProgress(courseId: string): number {
    // In a real app, this would calculate actual progress
    return Math.floor(Math.random() * 100);
  }
}
