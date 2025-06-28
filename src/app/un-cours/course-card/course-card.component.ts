import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogsService } from '../../services/logs.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnInit {

  @Input() name!: string;
  @Input() code!: string;
  @Input() imageUrl!: string;
  @Input() courseUrl!: string;
  @Input() progression!: number;
  @Input() nomimg!: string;

  constructor(
    private router: Router,
    private logsService: LogsService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.progression = 1
  }

  onAccessCourse(): void {
    const userId = this.usersService.getCurrentUserId();
    if (userId) {
      // Appel à l'API backend pour log la consultation
      this.usersService.getToken(); // S'assure que le token est récupéré
      this.usersService.getUeIdByCode(this.code).subscribe({
        next: (ue: any) => {
          const ueId = ue && ue._id ? ue._id : null;
          if (ueId) {
            // Appel à l'API pour créer le log côté serveur
            this.logsService.logUeConsultation(ueId).subscribe({
              next: () => {
                this.router.navigate([this.courseUrl]);
              },
              error: () => {
                this.router.navigate([this.courseUrl]);
              }
            });
          } else {
            this.router.navigate([this.courseUrl]);
          }
        },
        error: () => {
          this.router.navigate([this.courseUrl]);
        }
      });
    } else {
      this.router.navigate([this.courseUrl]);
    }
  }
}
