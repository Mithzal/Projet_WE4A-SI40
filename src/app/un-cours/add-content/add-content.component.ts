import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UeContent } from '../../../models/ue.model';
import { UEsService } from '../../services/ues.service';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.css']
})
export class AddContentComponent implements OnInit {
  contentForm: FormGroup;
  courseId: string | null = null;
  contentTypes = ['info', 'warning', 'file','return'];
  isSubmitting = false;
  errorMessage = '';
  hasFile = false;

  constructor(
    private fb: FormBuilder,
    private uesService: UEsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['text', Validators.required],
      text: ['', Validators.required],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');

    // Surveiller les changements de type pour gérer l'affichage du champ file
    this.contentForm.get('type')?.valueChanges.subscribe(type => {
      this.hasFile = ['document', 'image'].includes(type);
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

    const file = this.contentForm.value.file;

    if (this.courseId) {
      if (file && this.hasFile) {
        // Si un fichier est associé, d'abord l'uploader puis créer le contenu
        const formData = new FormData();
        formData.append('file', file);

        // TODO: Appeler le service d'upload de fichier
        // Exemple:
        // this.fileService.uploadFile(formData).subscribe(
        //   response => {
        //     newContent.fileId = response.fileId;
        //     this.addContentToCourse(newContent);
        //   },
        //   error => {
        //     this.handleError(error);
        //   }
        // );

        // Pour l'instant, on ajoute directement le contenu sans fichier
        this.addContentToCourse(newContent);
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
