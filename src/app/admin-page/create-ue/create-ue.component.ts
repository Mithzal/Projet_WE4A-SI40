import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UEsService } from '../../services/ues.service';
import { FileService } from '../../services/files.service';
import { User } from '../../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-ue',
  templateUrl: './create-ue.component.html',
  styleUrls: ['./create-ue.component.css']
})
export class CreateUeComponent implements OnInit {
  ueForm!: FormGroup;
  CurrentUser: User | null = null;
  @Input() teachers: User[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private service: UEsService,
    private UserService: UsersService,
    private fileService: FileService,
    private authService: AuthService
  ) {
    this.UserService.getTeachers().subscribe(data => {
      this.teachers = data;
    });
  }

  ngOnInit() {
    this.CurrentUser = this.authService.getCurrentUser();
    this.ueForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      credits: ['', [Validators.required, Validators.min(1)]],
      instructorId: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image.');
        return;
      }

      this.selectedFile = file;

      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.ueForm.valid) {
      const ueData = this.ueForm.value;

      // Si une image est sélectionnée, on crée d'abord l'UE, puis on upload l'image
      // pour pouvoir utiliser l'ID réel de l'UE comme coursId
      if (this.selectedFile) {
        // Créer l'UE d'abord
        this.service.addUe(ueData).subscribe({
          next: (ueResponse) => {
            console.log('UE créée avec succès:', ueResponse);

            // Maintenant, on peut uploader l'image en utilisant l'ID de l'UE
            const userId = this.CurrentUser?._id || '';
            const ueId = ueResponse._id;

            if (ueId) {
              this.fileService.uploadFile(this.selectedFile!, ueId, userId, `Image pour le cours ${ueData.name}`).subscribe({
                next: (fileResponse) => {
                  // Une fois le fichier uploadé, on récupère son ID et on met à jour l'UE
                  // Adaptation à la structure de réponse de l'API
                  let imageFileId;
                  if (fileResponse.fichier && fileResponse.fichier._id) {
                    imageFileId = fileResponse.fichier._id;
                  } else if (fileResponse._id) {
                    imageFileId = fileResponse._id;
                  }

                  console.log('Image uploadée avec succès:', fileResponse);

                  if (imageFileId) {
                    // Mettre à jour l'UE avec l'ID de l'image
                    // Récupérer l'UE pour mettre à jour uniquement le champ imageFileId
                    const updatedUe = { ...ueResponse }; // Copie de l'UE créée
                    updatedUe.imageFileId = imageFileId; // Ajout de l'ID de l'image

                    this.service.updateUe(updatedUe).subscribe({
                      next: () => {
                        console.log('UE mise à jour avec l\'image');
                        this.refresh.emit();
                        this.closeForm();
                      },
                      error: (err) => {
                        console.error('Erreur lors de la mise à jour de l\'UE avec l\'image:', err);
                        this.refresh.emit();
                        this.closeForm();
                      }
                    });
                  } else {
                    // Aucun ID d'image trouvé, mais l'UE est créée
                    this.refresh.emit();
                    this.closeForm();
                  }
                },
                error: (error) => {
                  console.error('Erreur lors de l\'upload de l\'image:', error);
                  alert('L\'UE a été créée, mais une erreur est survenue lors de l\'upload de l\'image.');
                  this.refresh.emit();
                  this.closeForm();
                }
              });
            } else {
              // Pas d'ID d'UE trouvé mais l'UE a été créée
              this.refresh.emit();
              this.closeForm();
            }
          },
          error: (err) => {
            console.error('Erreur lors de la création de l\'UE:', err);
            this.handleError(err);
          }
        });
      } else {
        // Pas d'image sélectionnée, on crée l'UE directement
        this.createUE(ueData);
      }
    }
  }

  createUE(ueData: any) {
    this.service.addUe(ueData).subscribe({
      next: (response) => {
        console.log('UE créée avec succès:', response);
        this.refresh.emit();
        this.closeForm();
      },
      error: (err: any) => {
        console.error('Erreur lors de la création de l\'UE:', err);
        let errorMsg = 'Erreur lors de la création de l\'UE.';
        // Si l'API retourne des erreurs de validation par champ
        if (err?.error) {
          if (typeof err.error === 'object') {
            // Cas d'un objet d'erreurs par champ
            errorMsg += '\n';
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errorMsg += `Champ "${key}" : ${err.error[key]}\n`;
              }
            }
          } else if (typeof err.error === 'string') {
            // Cas d'un message d'erreur simple
            errorMsg += `\n${err.error}`;
          }
        } else if (err?.message) {
          errorMsg += `\n${err.message}`;
        }
        alert(errorMsg);
      }
    });
  }

  handleError(err: any) {
    console.error('Erreur:', err);
    let errorMsg = 'Erreur lors de la création de l\'UE.';
    if (err?.error) {
      if (typeof err.error === 'object') {
        // Cas d'un objet d'erreurs par champ
        errorMsg += '\n';
        for (const key in err.error) {
          if (err.error.hasOwnProperty(key)) {
            errorMsg += `Champ "${key}" : ${err.error[key]}\n`;
          }
        }
      } else if (typeof err.error === 'string') {
        // Cas d'un message d'erreur simple
        errorMsg += `\n${err.error}`;
      }
    } else if (err?.message) {
      errorMsg += `\n${err.message}`;
    }
    alert(errorMsg);
  }

  closeForm() {
    this.close.emit();
  }
}
