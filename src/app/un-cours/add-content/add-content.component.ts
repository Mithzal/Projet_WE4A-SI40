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
  hasDate = false;
  enableContentDate = false;

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
      returnDate: [null],
      returnTime: [null], // New form control for return time
      enableContentDate: [false],
      contentDate: [null],
      contentTime: [null] // New form control for content time
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');

    // Initialisation de hasFile basée sur la valeur initiale du type
    const initialType = this.contentForm.get('type')?.value;
    this.hasFile = ['file'].includes(initialType);
    this.hasReturnDate = ['assignement'].includes(initialType);
    this.hasDate = ['info', 'warning'].includes(initialType);

    // Surveiller les changements de type pour gérer l'affichage des champs
    this.contentForm.get('type')?.valueChanges.subscribe(type => {
      this.hasFile = ['file'].includes(type);
      this.hasReturnDate = ['assignement'].includes(type);
      this.hasDate = ['info', 'warning'].includes(type);

      // Reset returnDate checkbox when switching types
      if (!this.hasReturnDate) {
        this.contentForm.patchValue({
          enableReturnDate: false,
          returnDate: null,
          returnTime: null
        });
      }

      // Reset contentDate checkbox when switching types
      if (!this.hasDate) {
        this.contentForm.patchValue({
          enableContentDate: false,
          contentDate: null,
          contentTime: null
        });
      }
    });

    // Monitor the enableReturnDate checkbox
    this.contentForm.get('enableReturnDate')?.valueChanges.subscribe(checked => {
      this.enableReturnDate = checked;
      if (checked) {
        // Set default return date to tomorrow at noon
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        // Format for separate date & time inputs
        this.contentForm.patchValue({
          returnDate: this.formatDateForInput(tomorrow),
          returnTime: this.formatTimeForInput(tomorrow)
        });
      } else {
        this.contentForm.patchValue({
          returnDate: null,
          returnTime: null
        });
      }
    });

    // Monitor the enableContentDate checkbox
    this.contentForm.get('enableContentDate')?.valueChanges.subscribe(checked => {
      this.enableContentDate = checked;
      if (checked) {
        // Set current date and time as default
        const now = new Date();
        this.contentForm.patchValue({
          contentDate: this.formatDateForInput(now),
          contentTime: this.formatTimeForInput(now)
        });
      } else {
        this.contentForm.patchValue({
          contentDate: null,
          contentTime: null
        });
      }
    });
  }

  /**
   * Formats a Date object into the YYYY-MM-DD string format for date inputs
   * @param date The Date object to format
   * @returns A string in the format YYYY-MM-DD
   */
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a Date object into the HH:MM string format for time inputs
   * @param date The Date object to format
   * @returns A string in the format HH:MM
   */
  private formatTimeForInput(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Combines date and time strings into a Date object
   * @param dateStr Date in format YYYY-MM-DD
   * @param timeStr Time in format HH:MM
   * @returns A Date object representing the combined date and time
   */
  private combineDateAndTime(dateStr: string, timeStr: string): Date | null {
    if (!dateStr) return null;

    try {
      // Parse the date part
      const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));

      // Default time values if time is not provided
      let hours = 0;
      let minutes = 0;

      // Parse the time part if provided
      if (timeStr) {
        [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
      }

      // Create the date object (months are 0-indexed in JavaScript Date)
      const result = new Date(year, month - 1, day, hours, minutes, 0);

      return isNaN(result.getTime()) ? null : result;
    } catch (error) {
      console.error('Error combining date and time:', error);
      return null;
    }
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

    // Log form values for debugging
    console.log('Form values raw:', this.contentForm.value);

    const newContent: UeContent = {
      title: this.contentForm.value.title,
      type: this.contentForm.value.type,
      text: this.contentForm.value.text
    };

    // Add returnDate if it's an assignment and the date is enabled
    if (this.contentForm.value.type === 'assignement' && this.contentForm.value.enableReturnDate && this.contentForm.value.returnDate) {
      try {
        // Combine date and time inputs
        const combinedDateTime = this.combineDateAndTime(
          this.contentForm.value.returnDate,
          this.contentForm.value.returnTime || '00:00'
        );

        if (combinedDateTime) {
          newContent.limitDate = combinedDateTime;
          console.log('Ajout date pour assignement:', newContent.limitDate);
          console.log('Date UTC string:', newContent.limitDate.toUTCString());
        }
      } catch (e) {
        console.error('Error parsing assignment return date:', e);
      }
    }

    // Add contentDate for info and warning types
    if (['info', 'warning'].includes(this.contentForm.value.type) && this.contentForm.value.enableContentDate && this.contentForm.value.contentDate) {
      try {
        // Combine date and time inputs
        const combinedDateTime = this.combineDateAndTime(
          this.contentForm.value.contentDate,
          this.contentForm.value.contentTime || '00:00'
        );

        if (combinedDateTime) {
          newContent.limitDate = combinedDateTime;
          console.log('Date convertie:', newContent.limitDate);
          console.log('Date UTC string:', newContent.limitDate.toUTCString());
        }
      } catch (e) {
        console.error('Error parsing info/warning content date:', e);
      }
    }

    const file = this.contentForm.value.file;

    if (this.courseId) {
      if (file && this.hasFile) {
        // Si un fichier est associé, d'abord l'uploader puis créer le contenu
        this.fileService.uploadFile(file, this.courseId, this.userService.getCurrentUserId()!, this.contentForm.value.text).subscribe({
          next: (response) => {
            newContent.fileId = response.fichier._id;
            this.addContentToCourse(newContent);
            console.log('Content with file:', newContent);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
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
    console.log('Content envoyé au serveur:', JSON.stringify(content));
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
