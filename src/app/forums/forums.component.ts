import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ForumService} from "../services/forum.service";
import {Forums, ForumMessage} from "../../models/forums.model";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit, OnChanges {
  @Input() courseId?: string;

  forum : Forums = {
    courseId: '',
    title: 'Chargement du forum...',
    messages: []
  }

  constructor(
    private service: ForumService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cette méthode est appelée quand une @Input property change
    if (changes['courseId'] && this.courseId) {
      this.loadForum();
    }
  }

  loadForum(): void {
    if (!this.courseId) {
      console.error('Pas de courseId fourni pour charger le forum');
      return;
    }

    // Réinitialiser le forum avant de charger les nouvelles données
    this.forum = {
      courseId: this.courseId,
      title: 'Chargement du forum...',
      messages: []
    };

    this.service.getForumById(this.courseId).subscribe(
      data => {
        this.forum = data;
      },
      error => {
        console.error('Erreur lors du chargement du forum:', error);
        // Définir un état d'erreur pour le forum
        this.forum.title = 'Erreur de chargement du forum';
      }
    );
  }

  // Méthode pour gérer les nouveaux messages ajoutés
  onMessageAdded(message: ForumMessage): void {
    // S'assurer que le tableau messages existe
    if (!this.forum.messages) {
      this.forum.messages = [];
    }

    // Ajouter le message à la liste locale
    this.forum.messages.push(message);
  }
}
