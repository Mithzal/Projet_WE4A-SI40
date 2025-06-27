import {Component, Input, OnInit} from '@angular/core';
import {UeContent} from "../../../models/ue.model";
import {FileService} from "../../services/files.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() content : UeContent = {
    type : '',
    title: '',
    text:  '',
  }
  fileName : string = "unknown"
  userName : string = "unknown"

  constructor(
    private fileService : FileService,
    private userService : UsersService
  ) { }

  ngOnInit(): void {
    if (this.content.fileId) {
      this.loadFileName();
    }
  }

  loadFileName() {
    if (this.content.fileId) {
      // Récupérer le nom du fichier si un fileId est présent
      this.fileService.getFileName(this.content.fileId).subscribe({
        next: (data: any) => {
          this.fileName = data.nom || "Nom de fichier non disponible";
        },
        error: (error) => {
          this.fileName = "Erreur de chargement";
        }
      });
    }
  }

  loadUserName(userId: string) {
    if (userId) {
      console.log("Chargement du nom d'utilisateur pour:", userId);
      this.userService.getNameById(userId).subscribe({
        next: (data: any) => {
          console.log("Données utilisateur reçues:", data);

          // Adaptation selon la structure de données renvoyée par l'API
          if (typeof data === 'string') {
            this.userName = data;
          } else if (data && data.name) {
            this.userName = data.name;
          } else if (data && data.firstName && data.lastName) {
            this.userName = data.firstName + ' ' + data.lastName;
          } else {
            this.userName = 'Nom non disponible';
          }

          console.log("Nom utilisateur défini:", this.userName);
        },
        error: (error) => {
          console.error("Erreur lors du chargement du nom utilisateur:", error);
          this.userName = "Erreur de chargement";
        }
      });
    } else {
      this.userName = "Non spécifié";
    }
  }

  downloadFile() {
    if (this.content.fileId) {
      console.log("Téléchargement du fichier:", this.content.fileId);
      this.fileService.downloadFile(this.content.fileId).subscribe({
        next: (response: any) => {
          // Créer un lien temporaire pour télécharger le fichier
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.fileName || `fichier_${this.content.fileId}`);
          document.body.appendChild(link);
          link.click();

          // Nettoyer le lien après le téléchargement
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error("Erreur lors du téléchargement du fichier:", error);
          alert("Erreur lors du téléchargement du fichier. Veuillez réessayer.");
        }
      });
    } else {
      console.error("Impossible de télécharger: ID de fichier non disponible");
    }
  }
}
