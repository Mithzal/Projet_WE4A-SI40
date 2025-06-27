import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Ue} from "../../../models/ue.model";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnChanges {
  @Input() course : Ue = {
    _id: '',
    code : '',
    name: '',
    description: '',
    instructorId : '',
    credits: 0,
  }
  name : string = "unknown"

  loadTeacherName() {
    if (this.course && this.course.instructorId) {
      this.UserService.getNameById(this.course.instructorId).subscribe({
        next: (data: any) => {
          // Adapter selon la structure de données réelle renvoyée par l'API
          if (typeof data === 'object' && data.name) {
            this.name = data.name;
          } else {
            this.name = 'Nom non disponible';
          }
        },
        error: (error) => {
          this.name = "Erreur de chargement";
        }
      });
    } else {
      this.name = "Non assigné";
    }
  }
  constructor(private UserService : UsersService) { }

  ngOnInit(): void {
    if (this.course._id) {
      this.loadTeacherName();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['course']) {
        this.loadTeacherName();
    }
  }
}
