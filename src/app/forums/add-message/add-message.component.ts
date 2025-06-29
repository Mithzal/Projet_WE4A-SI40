import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ForumMessage, Forums} from "../../../models/forums.model";
import {ForumService} from "../../services/forum.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css']
})
export class AddMessageComponent implements OnInit {
  @Input() forumId : string = '';
  @Input() forum: Forums = { courseId: '', title: '', messages: [] };
  @Output() messageAdded = new EventEmitter<ForumMessage>();

  // Nouveau message à ajouter
  newMessage: ForumMessage = {
    content: '',
    type: 'message',
    timestamp: new Date(),
    author: ''
  };

  constructor(private service : ForumService, private authService : AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.newMessage.author = currentUser.name || '';
    }
  }

  addNewMessage(): void {
    console.log(this.newMessage)
    if (!this.newMessage.content.trim()) {
      // Message vide, ne rien faire
      return;
    }

    // Mettre à jour l'horodatage
    this.newMessage.timestamp = new Date();
    let currentId = this.authService.getCurrentUser()?._id;
    if (currentId){
      this.newMessage.author = currentId; // Utiliser l'ID de l'utilisateur actuel
    }


    // Copier le message pour éviter les références
    const messageToAdd = {...this.newMessage};

    // Envoyer le message au serveur
    this.service.addMessageToForum(this.forumId, messageToAdd).subscribe(
      (response) => {
        console.log('Message ajouté avec succès:', response);
        // Émettre l'événement pour informer le composant parent
        this.messageAdded.emit(messageToAdd);
        // Réinitialiser le formulaire
        this.resetMessageForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du message:', error);
      }
    );
  }

  // Réinitialiser le formulaire
  resetMessageForm(): void {
    this.newMessage = {
      content: '',
      type: 'message',
      timestamp: new Date(),
      author: this.newMessage.author // Conserver l'auteur
    };
  }

}
