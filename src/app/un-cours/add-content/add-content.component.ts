import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UeContent } from '../../../models/ue.model';
import { UEsService } from '../../services/ues.service';
import {FileService} from "../../services/files.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.css']
})
export class AddContentComponent implements OnInit {
  contentForm: FormGroup;
  courseId: string | null = null;
  contentTypes = ['info', 'warning', 'file', 'assignement'];
  isSubmitting = false;
  errorMessage = '';
  hasFile = false;
  hasReturnDate = false;
  enableReturnDate = false;

  constructor(
    private fb: FormBuilder,
    private uesService: UEsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService : FileService,
    private userService: UsersService
  ) {
    this.contentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['info', Validators.required],
      text: ['', Validators.required],
      file: [null],
      enableReturnDate: [false],
      returnDate: [null]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');

    // Initialisation de hasFile basée sur la valeur initiale du type
    const initialType = this.contentForm.get('type')?.value;
    this.hasFile = ['file'].includes(initialType);
    this.hasReturnDate = ['assignement'].includes(initialType);

    // Surveiller les changements de type pour gérer l'affichage des champs
    this.contentForm.get('type')?.valueChanges.subscribe(type => {
      this.hasFile = ['file'].includes(type);
      this.hasReturnDate = ['assignement'].includes(type);

      // Reset returnDate checkbox when switching types
      if (!this.hasReturnDate) {
        this.contentForm.patchValue({
          enableReturnDate: false,
          returnDate: null
        });
      }
    });

    // Monitor the enableReturnDate checkbox
    this.contentForm.get('enableReturnDate')?.valueChanges.subscribe(checked => {
      this.enableReturnDate = checked;
      if (!checked) {
        this.contentForm.patchValue({
          returnDate: null
        });
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.contentForm.patchValue({
        file: file
      });
    }
  }

  onSubmit() {
    if (this.contentForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs requis.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newContent: UeContent = {
      title: this.contentForm.value.title,
      type: this.contentForm.value.type,
      text: this.contentForm.value.text
    };

    // Add returnDate if it's an assignment and the date is enabled
    if (this.contentForm.value.type === 'assignement' && this.contentForm.value.enableReturnDate) {
      newContent.returnDate = this.contentForm.value.returnDate;
    }

    const file = this.contentForm.value.file;

    if (this.courseId) {
      if (file && this.hasFile) {
        // Si un fichier est associé, d'abord l'uploader puis créer le contenu
        this.fileService.uploadFile(file, this.courseId, this.userService.getCurrentUserId()!, this.contentForm.value.text).subscribe(
          response => {
            newContent.fileId = response.fichier._id;
            this.addContentToCourse(newContent);
            console.log('Content with file:', newContent);
          },
          error => {
            this.handleError(error);
          }
        );
      } else {
        // Ajouter directement le contenu sans fichier
        this.addContentToCourse(newContent);
      }
    } else {
      this.errorMessage = 'ID du cours non spécifié';
      this.isSubmitting = false;
    }
  }

  private addContentToCourse(content: UeContent) {
    this.uesService.addContentToUe(this.courseId!, content).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/cours', this.courseId]);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    this.isSubmitting = false;
    this.errorMessage = 'Une erreur s\'est produite lors de l\'ajout du contenu. Veuillez réessayer.';
    console.error('Erreur lors de l\'ajout du contenu:', error);
  }

  cancel() {
    this.router.navigate(['/cours', this.courseId]);
  }
}
