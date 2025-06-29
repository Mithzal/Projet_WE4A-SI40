import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../services/files.service';
import { ActivatedRoute } from '@angular/router';
import { Files } from '../../models/file.model';



@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  @Input() courseId: string = '6848228ed236b2088786f79e';

  files: Files[] = [];
  selectedFile: any = null;
  uploadProgress: number = 0;
  description: string = '';
  isUploading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  userId: string = '';

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute
  ) {
    // Récupérer l'ID de l'utilisateur depuis le localStorage ou un service d'authentification
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userId = user._id || user.id || '';
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    }
  }

  ngOnInit(): void {
    // Si courseId n'est pas fourni comme Input, essayer de le récupérer depuis l'URL
    if (!this.courseId) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.courseId = id;
          this.loadFiles();
        }
      });
    } else {
      this.loadFiles();
    }
  }

  loadFiles(): void {
    if (!this.courseId) return;

    this.fileService.getFiles().subscribe(
      response => {
        if (response && response.success) {
          this.files = response.fichiers || response.files || [];
        }
      },
      error => {
        console.error('Erreur lors du chargement des fichiers :', error);
        this.errorMessage = 'Erreur lors du chargement des fichiers.';
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier.';
      return;
    }

    if (!this.courseId) {
      this.errorMessage = 'ID de cours manquant.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.fileService.uploadFile(this.selectedFile,'684820a0501b9717a9b1ba44', '68481c3d11b909893f8ff4ec', this.description ).subscribe(
      response => {
        if (response && response.success) {
          this.successMessage = 'Fichier téléchargé avec succès.';
          this.description = '';
          this.loadFiles(); // Recharger la liste des fichiers
        } else {
          this.errorMessage = 'Erreur lors du téléchargement du fichier.';
        }
        this.isUploading = false;
      },
      error => {
        console.error('Erreur lors du téléchargement du fichier :', error);
        this.errorMessage = error.message || 'Erreur lors du téléchargement du fichier.';
        this.isUploading = false;
      }
    );
  }

  // Fonction utilitaire pour formater la taille du fichier
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  download(fileId: string, fileName : string): void {
    this.fileService.downloadFile(fileId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Erreur lors du téléchargement du fichier :', error);
        this.errorMessage = 'Erreur lors du téléchargement du fichier.';
      }
    );
  }

  deleteFile(fileId: string): void {
    if (!fileId) {
      this.errorMessage = 'ID de fichier manquant.';
      return;
    }

    this.fileService.deleteFile(fileId).subscribe(
      response => {
        if (response && response.success) {
          this.successMessage = 'Fichier supprimé avec succès.';
          this.loadFiles(); // Recharger la liste des fichiers
        } else {
          this.errorMessage = 'Erreur lors de la suppression du fichier.';
        }
      },
      error => {
        console.error('Erreur lors de la suppression du fichier :', error);
        this.errorMessage = error.message || 'Erreur lors de la suppression du fichier.';
      }
    );
  }

}
