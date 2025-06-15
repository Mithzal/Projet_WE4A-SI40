import { Component, OnInit } from '@angular/core';
import { UEsService } from "../services/ues.service";
import { UsersService } from "../services/users.service";
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

  // Current user
  currentUser: User = {
    _id: "684dc8793a0e6e40c1aa96e5",
    name: "Alex Ramallo",
    email: "alex.ramallo@mail.com",
    role: "student",
    courses: [],
    password: "alex",
  };

  userCourses: Ue[] = [];

  // Sample news items (would normally come from a service)
  newsItems: NewsItem[] = [
    { text: "Nouveau chapitre disponible dans Math 101", courseId: "1" },
    { text: "Examen blanc disponible pour Physics 101", courseId: "2" }
  ];

  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';

  constructor(private usersService: UsersService, private uesService: UEsService) { }

  ngOnInit(): void {
    this.fetchUserCourses();
  }

  // Fetch user courses from API - same as in tableau-de-bord
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
