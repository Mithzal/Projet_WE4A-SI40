import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @Input() userId!: number;
  @Output() close = new EventEmitter<void>();

  // Ajoutez ici les champs du formulaire, à remplir avec les données de l'utilisateur

  constructor() { }

  ngOnInit(): void {
    // Charger les données de l'utilisateur à partir de userId
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    // Envoyer les modifications
    this.close.emit();
  }
}
