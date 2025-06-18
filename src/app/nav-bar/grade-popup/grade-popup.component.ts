import {Component, OnInit} from '@angular/core';
import {Notes} from "../../../models/notes.model";
import {NotesService} from "../../services/notes.service";
import {UEsService} from "../../services/ues.service";
import {Ue} from "../../../models/ue.model";
import {forkJoin, map, Observable} from 'rxjs';

interface NoteParUe {
  ueId: string;
  ueName: string;
  notes: number[];
  moyenne: number;
}

@Component({
  selector: 'app-grade-popup',
  templateUrl: './grade-popup.component.html',
  styleUrls: ['./grade-popup.component.css']
})
export class GradePopupComponent implements OnInit {
  public notes: Notes[] = []
  private currentId = '68481c3d11b909893f8ff4ec'
  public names: string[] = [];
  public name: string = "default";
  public notesParUe: NoteParUe[] = [];

  constructor(private service: NotesService, private UesService: UEsService) {
    this.chargerNotes();
  }

  chargerNotes() {
    this.service.getNotesByStudent(this.currentId).subscribe(notes => {
      this.notes = notes;

      // Créer un dictionnaire pour regrouper les notes par UE
      const groupeParUe: { [key: string]: number[] } = {};
      const observables: Observable<Ue>[] = [];

      // Regrouper les notes par UE
      this.notes.forEach(note => {
        if (!groupeParUe[note.ueId]) {
          groupeParUe[note.ueId] = [];
          observables.push(this.getNameById(note.ueId));
        }
        groupeParUe[note.ueId].push(note.value);
      });

      // Récupérer tous les noms des UEs
      forkJoin(observables).subscribe(ues => {
        let index = 0;
        for (const ueId in groupeParUe) {
          if (groupeParUe.hasOwnProperty(ueId)) {
            const notes = groupeParUe[ueId];
            const moyenne = this.calculerMoyenne(notes);

            this.notesParUe.push({
              ueId,
              ueName: ues[index].name,
              notes,
              moyenne
            });

            this.names.push(ues[index].name);
            index++;
          }
        }
      });
    });
  }

  calculerMoyenne(notes: number[]): number {
    if (notes.length === 0) return 0;
    const somme = notes.reduce((acc, note) => acc + note, 0);
    return somme / notes.length;
  }

  getNameById(id: string): Observable<Ue> {
    return this.UesService.getNameById(id);
  }

  closeGradePopup() {
    const popup = document.getElementById('gradePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  ngOnInit(): void {
  }
}
