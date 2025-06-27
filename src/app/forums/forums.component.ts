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

  notFound: boolean = false;
  isCreating: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  newForumTitle: string = '';
  isAdminOrTeacher: boolean = false;

  constructor(
    private service: ForumService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est admin ou professeur
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.isAdminOrTeacher = currentUser.role === 'Admin' || currentUser.role === 'Teacher';
    }
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
        this.notFound = false; // Réinitialiser l'état notFound si le forum est chargé avec succès
      },
      error => {
        console.error('Erreur lors du chargement du forum:', error);
        // Définir un état d'erreur pour le forum
        this.forum.title = 'Erreur de chargement du forum';
        this.notFound = true;
      }
    );
  }

  // Affiche ou cache le formulaire de création de forum
  showCreateFormToggle(): void {
    this.showCreateForm = true;
    // Définir un titre par défaut suggéré
    this.newForumTitle = `Forum du cours `;
  }

  // Annule la création du forum
  cancelCreateForum(): void {
    this.showCreateForm = false;
    this.newForumTitle = '';
  }

  // Confirme la création du forum avec le titre personnalisé
  confirmCreateForum(): void {
    if (!this.courseId || !this.newForumTitle.trim()) {
      return;
    }

    this.isCreating = true;

    this.service.createForum(this.courseId, this.newForumTitle.trim()).subscribe(
      (createdForum) => {
        this.forum = createdForum;
        this.notFound = false;
        this.isCreating = false;
        this.showCreateForm = false;
        this.newForumTitle = '';
      },
      (error) => {
        console.error('Erreur lors de la création du forum:', error);
        this.isCreating = false;
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

  // Affiche le formulaire de modification du titre du forum
  showEditForumForm(): void {
    this.showEditForm = true;
    this.newForumTitle = this.forum.title; // Initialiser avec le titre actuel
  }

  // Annule la modification du titre
  cancelEditForum(): void {
    this.showEditForm = false;
    this.newForumTitle = '';
  }

  // Confirme la modification du titre du forum
  confirmEditForum(): void {
    if (!this.forum._id || !this.newForumTitle.trim()) {
      return;
    }

    // Créer une copie du forum avec le nouveau titre
    const updatedForum = { ...this.forum, title: this.newForumTitle.trim() };

    this.service.updateForumTitle(this.forum._id, this.newForumTitle.trim()).subscribe(
      (updatedData) => {
        this.forum = updatedData;
        this.showEditForm = false;
        this.newForumTitle = '';
      },
      (error) => {
        console.error('Erreur lors de la modification du titre du forum:', error);
      }
    );
  }
}
