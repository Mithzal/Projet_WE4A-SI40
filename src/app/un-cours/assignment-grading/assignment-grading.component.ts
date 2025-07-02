import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { NotesService } from '../../services/notes.service';
import { UsersService } from '../../services/users.service';
import { FileService } from '../../services/files.service';
import { UeReturn } from '../../../models/ue.model';
import { Notes } from '../../../models/notes.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface SubmissionWithGrade {
  submission: UeReturn;
  grade: Notes | null;
  isExpanded: boolean;
}

@Component({
  selector: 'app-assignment-grading',
  templateUrl: './assignment-grading.component.html',
  styleUrls: ['./assignment-grading.component.css']
})
export class AssignmentGradingComponent implements OnInit {
  courseId: string = '';
  assignmentId: string = '';
  assignmentTitle: string = 'Devoir';
  submissions: SubmissionWithGrade[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  selectedSubmission: SubmissionWithGrade | null = null;

  // Grading form
  currentGrade: number | null = null;
  currentComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService,
    private notesService: NotesService,
    private usersService: UsersService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.assignmentId = this.route.snapshot.paramMap.get('assignmentId') || '';

    if (!this.courseId || !this.assignmentId) {
      this.errorMessage = 'Paramètres manquants. Impossible de charger les soumissions.';
      this.isLoading = false;
      return;
    }

    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.isLoading = true;

    this.assignmentService.getAllSubmissions(this.courseId, this.assignmentId)
      .subscribe({
        next: (submissions) => {
          if (submissions.length === 0) {
            this.submissions = [];
            this.isLoading = false;
            return;
          }

          // Create an array of observables for each submission to get its grade
          const submissionObservables = submissions.map(submission => {
            // Check if submission has a gradeId first - this is more efficient
            if (submission.gradeId) {
              // If the submission already has a gradeId, directly fetch that grade
              return this.notesService.updateGrade(submission.gradeId, {} as Notes) // Using updateGrade as a getter
                .pipe(
                  catchError(() => {
                    // If fetching by gradeId fails, try the fallback method
                    return this.notesService.getSubmissionGrade(this.assignmentId, submission.userId)
                      .pipe(catchError(() => of(null)));
                  }),
                  map(grade => ({
                    submission,
                    grade,
                    isExpanded: false
                  }))
                );
            } else {
              // Otherwise use the assignment-student lookup method
              return this.notesService.getSubmissionGrade(this.assignmentId, submission.userId)
                .pipe(
                  catchError(() => of(null)),
                  map(grade => ({
                    submission,
                    grade,
                    isExpanded: false
                  }))
                );
            }
          });

          // Wait for all grade requests to complete
          forkJoin(submissionObservables).subscribe({
            next: (results) => {
              this.submissions = results;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error fetching grades:', error);
              // Still show submissions even if grades failed to load
              this.submissions = submissions.map(submission => ({
                submission,
                grade: null,
                isExpanded: false
              }));
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error loading submissions:', error);
          this.errorMessage = 'Erreur lors du chargement des soumissions.';
          this.isLoading = false;
        }
      });
  }

  toggleSubmission(submission: SubmissionWithGrade): void {
    submission.isExpanded = !submission.isExpanded;

    if (submission.isExpanded) {
      this.selectedSubmission = submission;
      this.currentGrade = submission.grade?.value ?? null;
      this.currentComment = submission.grade?.comments ?? '';
    } else {
      this.selectedSubmission = null;
    }
  }

  downloadSubmission(submission: UeReturn): void {
    if (!submission || !submission.fileId) {
      alert("Aucun fichier à télécharger");
      return;
    }

    this.fileService.downloadFile(submission.fileId).subscribe({
      next: (response: any) => {
        // Create temporary link to download file
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', submission.fileName || `submission.file`);
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

  saveGrade(): void {
    if (!this.selectedSubmission || this.currentGrade === null) {
      alert('Veuillez sélectionner une soumission et saisir une note valide.');
      return;
    }

    const submission = this.selectedSubmission.submission;
    const grade: Notes = this.selectedSubmission.grade ? { ...this.selectedSubmission.grade } : new Notes(
      submission.userId,
      this.courseId,
      this.currentGrade,
      new Date(),
      this.usersService.getCurrentUserId()!,
      this.currentComment,
      undefined,
      this.assignmentId,
      submission._id
    );

    // Update values if grade already exists
    if (this.selectedSubmission.grade) {
      grade.value = this.currentGrade;
      grade.comments = this.currentComment;
      grade.timestamp = new Date();
    }

    this.notesService.saveGrade(grade).subscribe({
      next: (savedGrade) => {
        // Update the grade in the UI
        this.selectedSubmission!.grade = savedGrade;
        // Also update the gradeId in the submission object to maintain the link
        if (!this.selectedSubmission!.submission.gradeId && savedGrade._id) {
          this.selectedSubmission!.submission.gradeId = savedGrade._id;
        }
        this.successMessage = 'Note enregistrée avec succès!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving grade:', error);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la note.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  getSubmissionDate(submission: UeReturn): string {
    if (!submission.submissionDate) {
      return 'Date inconnue';
    }
    return new Date(submission.submissionDate).toLocaleString();
  }

  backToCourse(): void {
    this.router.navigate(['/cours', this.courseId]);
  }
}
