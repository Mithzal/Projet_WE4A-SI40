import { Component, OnInit } from '@angular/core';
import {Ue} from "../../models/ue.model";
import {UEsService} from "../services/ues.service";

@Component({
  selector: 'app-recherche-cours',
  templateUrl: './recherche-cours.component.html',
  styleUrls: ['./recherche-cours.component.css']
})
export class RechercheCoursComponent implements OnInit {

  variableTitre: string = 'Recherche de Cours';
  UEs_details: Ue[] = [];
  teachersByCourse: any[] = [];

  constructor(private service : UEsService) {
    this.service.getData().subscribe(data => {
      this.UEs_details = data
    })
  }
  ajouterNouvelleUe(): void {
    // Créez un nouvel objet Ue
    const nouvelleUe: Ue = {
      name: 'Nouvelle UE',
      code: 'DT20',
      description: 'Bullshit Ue',
      credits: 3,
      instructorId: '68481c5611b909893f8ff4f0'
    };

    // Appelez la méthode addUe et souscrivez à l'Observable
    this.service.addUe(nouvelleUe).subscribe({
      next: (ueAjoutee) => {
        console.log('UE ajoutée avec succès:', ueAjoutee);
        // Traitez la réponse (par exemple, mise à jour de la liste)
      },
      error: (erreur) => {
        console.error('Erreur lors de l\'ajout de l\'UE:', erreur);
        // Gérez l'erreur (affichage d'un message, etc.)
      }
    });
  }

  modifierUe(ue: Ue): void {
    // Modifiez les propriétés de l'UE
    const nouvelleUe: Ue = {
      ...ue,
      name: 'Physique Avancées',
      description: 'Méchanique du point go brr'
    };

    // Appelez la méthode updateUe et souscrivez à l'Observable
    this.service.updateUe(nouvelleUe).subscribe({
      next: (ueModifiee) => {
        console.log('UE modifiée avec succès:', ueModifiee);
        // Traitez la réponse (par exemple, mise à jour de la liste)
      },
      error: (erreur) => {
        console.error('Erreur lors de la modification de l\'UE:', erreur);
        // Gérez l'erreur (affichage d'un message, etc.)
      }
    });
  }

  supprimerUe(id: number | undefined ): void {
    // Appelez la méthode deleteUe et souscrivez à l'Observable
    if (id !== null) {
      this.service.deleteUe(id).subscribe({
        next: () => {
          console.log('UE supprimée avec succès');
          // Traitez la réponse (par exemple, mise à jour de la liste)
          this.UEs_details = this.UEs_details.filter(ue => ue._id !== id);
        },
        error: (erreur) => {
          console.error('Erreur lors de la suppression de l\'UE:', erreur);
          // Gérez l'erreur (affichage d'un message, etc.)
        }
      });
    }
  }


  ngOnInit(): void {
    // Initialize your data here, possibly from a service
  }

  getTeachersByCourse(courseId: number | undefined): string {

    return "John Doe";
  }
}
