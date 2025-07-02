import {Component, Input, OnInit} from '@angular/core';
import {UeContent, UeReturn} from "../../../models/ue.model";
import {FileService} from "../../services/files.service";
import {UsersService} from "../../services/users.service";
import {AssignmentService} from "../../services/assignment.service";
import {NotesService} from "../../services/notes.service";
import {Notes} from "../../../models/notes.model";
import {Files} from "../../../models/file.model";
import { UEsService } from '../../services/ues.service';

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
  @Output() postDeleted = new EventEmitter<string>();
  fileName : string = "unknown"
  userName : string = "unknown"
  selectedFile: File | null = null;
  currentUserId: string = '';
  courseId: string = '';
  uploadError: string = '';
  uploadSuccess: boolean = false;
  userSubmission: UeReturn | null = null;
  isLoading: boolean = true;
  editMode: boolean = false;
  isInstructor: boolean = false; // Ajout de la propriété isInstructor

  // Grading related properties
  isTeacher: boolean = false;
  isAdmin: boolean = false;
  gradingMode: boolean = false;
  submissionGrade: Notes | null = null;
  gradeValue: number | null = null;
  gradeComment: string = '';
  gradingError: string = '';
  gradingSuccess: boolean = false;

  constructor(
    private fileService : FileService,
    private userService : UsersService,
    private assignmentService: AssignmentService,
    private ueService: UEsService, // Ajout du service UEsService
    private notesService: NotesService
  ) { }

  ngOnInit(): void {
    if (this.content.fileId) {
      this.loadFileName();
    }
    this.currentUserId = this.userService.getCurrentUserId()!;
    this.courseId = window.location.pathname.split('/').pop() || '';
    this.loadUserName(this.currentUserId);

    // Check user roles
    this.isTeacher = this.userService.isUserTeacher();
    this.isAdmin = this.userService.isUserAdmin();

    if (this.content.type === 'assignement' && this.content._id) {
      this.checkUserSubmission();
    }

    // Check if the current user is a teacher and load the submission grade if in grading mode
    this.gradingMode = this.content.type === 'assignement' && this.gradingMode;

    if (this.gradingMode && this.content._id) {
      this.loadSubmissionGrade();
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

  checkUserSubmission() {
    this.isLoading = true;
    console.log('Checking for user submission...');

    if (!this.content._id) {
      console.warn('Cannot check submission: content._id is missing');
      this.isLoading = false;
      return;
    }

    if (!this.courseId) {
      console.warn('Cannot check submission: courseId is missing');
      this.isLoading = false;
      return;
    }

    if (!this.currentUserId) {
      console.warn('Cannot check submission: currentUserId is missing');
      this.isLoading = false;
      return;
    }

    console.log(`Fetching submission for course: ${this.courseId}, content: ${this.content._id}, user: ${this.currentUserId}`);

    this.assignmentService.getUserSubmission(this.courseId, this.content._id, this.currentUserId)
      .subscribe({
        next: (submission: UeReturn | null) => {
          if (submission) {
            this.userSubmission = submission;
            console.log('User submission found:', submission);
          } else {
            console.log('No submission found for this user');
            this.userSubmission = null;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error checking submission:', error);
          this.userSubmission = null;
          this.isLoading = false;
        },
        complete: () => {
          console.log('Submission check complete');
        }
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Fichier sélectionné:', this.selectedFile.name);
    }
  }

  isSubmissionClosed(): boolean {
    if (!this.content.returnDate) {
      return false;  // No return date means always open
    }

    const returnDate = new Date(this.content.returnDate);
    const now = new Date();

    return now > returnDate;
  }

  uploadAssignmentFile() {
    if (!this.selectedFile) {
      this.uploadError = 'Aucun fichier sélectionné';
      return;
    }

    if (this.isSubmissionClosed()) {
      this.uploadError = 'La date limite de dépôt est dépassée';
      return;
    }

    // Create custom filename: username_contentname_filename
    const fileExt = this.selectedFile.name.split('.').pop() || '';
    const sanitizedTitle = this.content.title.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    const sanitizedUsername = this.userName.replace(/\s+/g, '_').replace(/[^\w]/g, '');

    // Create a new file with the custom name
    const customFileName = `${sanitizedUsername}_${sanitizedTitle}_${Date.now()}.${fileExt}`;
    const customFile = new File(
      [this.selectedFile],
      customFileName,
      { type: this.selectedFile.type }
    );

    console.log('Uploading assignment with filename:', customFileName);
    const description = `Dépôt pour: ${this.content.title}`;

    // Upload the file first
    this.fileService.uploadFile(customFile, this.courseId, this.currentUserId, description).subscribe({
      next: (fileResponse) => {
        console.log('File upload success:', fileResponse);

        // Now submit the assignment with the file reference
        if (fileResponse && fileResponse.fichier && fileResponse.fichier._id && this.content._id) {
          this.assignmentService.submitAssignment(
            this.courseId,
            this.content._id,
            this.currentUserId,
            fileResponse.fichier._id,
            customFileName
          ).subscribe({
            next: (response) => {
              console.log('Assignment submission success:', response);
              this.uploadSuccess = true;
              this.uploadError = '';
              this.selectedFile = null;

              // Reset file input
              const fileInput = document.getElementById('fileInput') as HTMLInputElement;
              if (fileInput) {
                fileInput.value = '';
              }

              // Refresh submission status
              this.checkUserSubmission();

              // Update UI to show successful upload
              alert('Fichier déposé avec succès!');
            },
            error: (error) => {
              console.error('Assignment submission failed:', error);
              this.uploadError = 'Erreur lors de l\'enregistrement du devoir: ' +
                (error.error?.message || error.message || 'Erreur inconnue');
              this.uploadSuccess = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('File upload failed:', error);
        this.uploadError = 'Erreur lors du dépôt du fichier: ' +
          (error.error?.message || error.message || 'Erreur inconnue');
        this.uploadSuccess = false;
      }
    });
  }

  toggleEditMode() {
    if (!this.isSubmissionClosed()) {
      this.editMode = !this.editMode;
      // Reset selected file when canceling edit
      if (!this.editMode) {
        this.selectedFile = null;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    }
  }

  replaceSubmission() {
    if (!this.selectedFile || !this.userSubmission) {
      this.uploadError = 'Aucun fichier sélectionné';
      return;
    }

    if (this.isSubmissionClosed()) {
      this.uploadError = 'La date limite de modification est dépassée';
      return;
    }

    // Create custom filename: username_contentname_filename
    const fileExt = this.selectedFile.name.split('.').pop() || '';
    const sanitizedTitle = this.content.title.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    const sanitizedUsername = this.userName.replace(/\s+/g, '_').replace(/[^\w]/g, '');

    // Create a new file with the custom name
    const customFileName = `${sanitizedUsername}_${sanitizedTitle}_${Date.now()}.${fileExt}`;
    const customFile = new File(
      [this.selectedFile],
      customFileName,
      { type: this.selectedFile.type }
    );

    console.log('Replacing submission with filename:', customFileName);
    const description = `Modification du dépôt pour: ${this.content.title}`;

    // Delete the old file
    this.fileService.deleteFile(this.userSubmission.fileId).subscribe({
      next: () => {
        console.log('Old file deleted successfully');
        this.uploadReplacementFile(customFile, description);
      },
      error: (error) => {
        console.error('Failed to delete old file:', error);
        // Continue with submission anyway with user notification
        alert('Impossible de supprimer l\'ancien fichier, mais nous allons quand même télécharger le nouveau.');
        this.uploadReplacementFile(customFile, description);
      }
    });
  }

  uploadReplacementFile(customFile: File, description: string) {
    // Upload the new file
    this.fileService.uploadFile(customFile, this.courseId, this.currentUserId, description).subscribe({
      next: (fileResponse) => {
        console.log('Replacement file uploaded successfully:', fileResponse);

        // Now delete the old submission from the UE
        if (this.userSubmission && this.userSubmission._id && this.content._id) {
          this.assignmentService.deleteAssignment(
            this.courseId,
            this.content._id,
            this.userSubmission._id
          ).subscribe({
            next: (deleteResponse) => {
              console.log('Old submission deleted successfully:', deleteResponse);

              // Submit the new assignment
              if (fileResponse && fileResponse.fichier && fileResponse.fichier._id && this.content._id) {
                this.assignmentService.submitAssignment(
                  this.courseId,
                  this.content._id,
                  this.currentUserId,
                  fileResponse.fichier._id,
                  fileResponse.fichier.nom || customFile.name
                ).subscribe({
                  next: (submitResponse) => {
                    console.log('New submission created successfully:', submitResponse);
                    this.uploadSuccess = true;
                    this.uploadError = '';
                    this.selectedFile = null;
                    this.editMode = false;

                    // Reset file input
                    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }

                    // Refresh submission status
                    this.checkUserSubmission();

                    // Update UI to show successful upload
                    alert('Soumission mise à jour avec succès!');
                  },
                  error: (error) => {
                    console.error('Failed to create new submission:', error);
                    this.uploadError = 'Erreur lors de la création de la nouvelle soumission: ' +
                      (error.error?.message || error.message || 'Erreur inconnue');
                  }
                });
              }
            },
            error: (error) => {
              console.error('Failed to delete old submission:', error);
              // Continue with new submission anyway
              alert('Impossible de supprimer l\'ancienne soumission, mais le fichier a été mis à jour.');
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to upload replacement file:', error);
        this.uploadError = 'Erreur lors du téléchargement du nouveau fichier: ' +
          (error.error?.message || error.message || 'Erreur inconnue');
      }
    });
  }

  downloadUserSubmission() {
    if (!this.userSubmission || !this.userSubmission.fileId) {
      alert("Aucun fichier à télécharger");
      return;
    }

    this.fileService.downloadFile(this.userSubmission.fileId).subscribe({
      next: (response: any) => {
        // Create temporary link to download file
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.userSubmission?.fileName || `submission.file`);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error("Erreur lors du téléchargement de la soumission:", error);
        alert("Erreur lors du téléchargement de la soumission. Veuillez réessayer.");
      }
    });
  }

  getSubmissionDate(): string {
    if (!this.userSubmission || !this.userSubmission.submissionDate) {
      return '';
    }
    return new Date(this.userSubmission.submissionDate).toLocaleString();
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

  loadSubmissionGrade() {
    if (!this.content._id || !this.currentUserId) {
      return;
    }

    this.notesService.getSubmissionGrade(this.content._id, this.currentUserId).subscribe({
      next: (grade: Notes | null) => {
        this.submissionGrade = grade;

        if (grade) {
          this.gradeValue = grade.value;
          this.gradeComment = grade.comments || '';
        } else {
          this.gradeValue = null;
          this.gradeComment = '';
        }
      },
      error: (error) => {
        console.error('Error loading submission grade:', error);
        this.gradingError = 'Erreur lors du chargement de la note';
      }
    });
  }

  saveGrade() {
    if (!this.submissionGrade || this.gradeValue === null) {
      this.gradingError = 'Veuillez entrer une note valide';
      return;
    }

    this.submissionGrade.value = this.gradeValue;
    this.submissionGrade.comments = this.gradeComment;

    this.notesService.saveGrade(this.submissionGrade).subscribe({
      next: () => {
        this.gradingSuccess = true;
        this.gradingError = '';
        alert('Note enregistrée avec succès!');
      },
      error: (error) => {
        console.error('Error saving grade:', error);
        this.gradingError = 'Erreur lors de l\'enregistrement de la note';
      }
    });
  }

  toggleGradingMode() {
    this.gradingMode = !this.gradingMode;

    if (this.gradingMode) {
      this.loadSubmissionGrade();
    } else {
      this.submissionGrade = null;
      this.gradeValue = null;
      this.gradeComment = '';
    }
  }
}
