# Diagramme des Services Angular

```plantuml
@startuml Services_Angular

' Style du diagramme
skinparam componentStyle uml2
skinparam component {
  BorderColor #3498db
  BackgroundColor #ecf0f1
  ArrowColor #34495e
  FontName Arial
  FontSize 12
}

package "Services Angular" {
  [AuthService] as auth_service
  [UserService] as user_service
  [UEService] as ue_service
  [CoursService] as cours_service
  [ForumService] as forum_service
  [FichierService] as fichier_service
  [NotesService] as notes_service
  [LogsService] as logs_service
}

' Services liés aux composants
auth_service --> [LoginComponent] : utilisé par
auth_service --> [NavBarComponent] : utilisé par
user_service --> [ProfileComponent] : utilisé par
user_service --> [UserListComponent] : utilisé par
ue_service --> [UeListComponent] : utilisé par
ue_service --> [MesCoursComponent] : utilisé par
cours_service --> [UnCoursComponent] : utilisé par
forum_service --> [PostComponent] : utilisé par
fichier_service --> [FileComponent] : utilisé par
notes_service --> [GradePopupComponent] : utilisé par
logs_service --> [LogsListComponent] : utilisé par

' Services liés aux modèles
user_service --> [UserModel] : manipule
ue_service --> [UEModel] : manipule
forum_service --> [ForumModel] : manipule
fichier_service --> [FileModel] : manipule
notes_service --> [NotesModel] : manipule
logs_service --> [LogModel] : manipule

' Interactions entre services
auth_service <-- user_service : dépend de
logs_service <-- auth_service : enregistre des actions
logs_service <-- user_service : enregistre des actions
logs_service <-- ue_service : enregistre des actions
logs_service <-- cours_service : enregistre des actions

note bottom of auth_service : Gère l'authentification et les autorisations
note bottom of logs_service : Service transversal d'enregistrement des activités

@enduml
```

## Description du diagramme

Ce diagramme montre l'architecture des services Angular dans l'application et leurs interactions. Les services sont des éléments centraux de l'architecture Angular, fournissant des fonctionnalités partagées et un moyen d'encapsuler la logique métier.

Le diagramme met en évidence :
- Les différents services de l'application
- Les relations entre les services et les composants qui les utilisent
- Les relations entre les services et les modèles de données qu'ils manipulent
- Les dépendances entre les différents services
