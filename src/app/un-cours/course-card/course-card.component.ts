import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogsService } from '../../services/logs.service';
import { UsersService } from '../../services/users.service';
import { FileService } from '../../services/files.service';
import { environment } from '../../../environments/environment';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnInit {

  @Input() name!: string;
  @Input() code!: string;
  @Input() imageUrl!: string;
  @Input() imageFileId!: string;  // Nouvel attribut pour stocker l'ID du fichier image
  @Input() courseUrl!: string;
  @Input() progression!: number;
  @Input() nomimg!: string;

  actualImageUrl!: string | SafeUrl;  // URL réelle de l'image à afficher
  isLoading: boolean = true;  // Indicateur de chargement

  constructor(
    private router: Router,
    private logsService: LogsService,
    private usersService: UsersService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.progression = 1;
    this.isLoading = true;

    // Déterminer l'URL de l'image à afficher
    if (this.imageFileId) {
      // Si un ID de fichier est fourni, utiliser la méthode sécurisée pour obtenir l'image
      console.log('Chargement de l\'image depuis l\'API avec ID:', this.imageFileId);
      this.fileService.getSecureImageUrl(this.imageFileId).subscribe({
        next: (safeUrl) => {
          this.actualImageUrl = safeUrl;
          this.isLoading = false;
          console.log('Image chargée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'image:', err);
          this.actualImageUrl = '/assets/no_image.webp';
          this.isLoading = false;
        }
      });
    } else if (this.imageUrl) {
      // Sinon utiliser l'URL directe si disponible
      this.actualImageUrl = this.imageUrl;
      this.isLoading = false;
      console.log('Utilisation de l\'image depuis l\'URL directe:', this.imageUrl);
    } else {
      // Image par défaut si aucune image n'est spécifiée
      this.actualImageUrl = '/assets/no_image.webp';
      this.isLoading = false;
      console.log('Aucune image spécifiée, utilisation de l\'image par défaut');
    }
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
