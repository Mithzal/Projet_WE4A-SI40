# Diagramme des Modules Angular

```plantuml
@startuml Modules_Angular

' Style du diagramme
skinparam componentStyle uml2
skinparam component {
  BorderColor #3498db
  BackgroundColor #ecf0f1
  ArrowColor #34495e
  FontName Arial
  FontSize 12
}

package "Modules Angular" {
  [AppModule] as app_module
  [AppRoutingModule] as routing_module
  
  ' Supposons ces modules basés sur la structure du projet
  [AuthModule] as auth_module
  [AdminModule] as admin_module
  [CoursModule] as cours_module
  [SharedModule] as shared_module
}

' Relations entre modules
app_module --> routing_module : importe
app_module --> auth_module : importe
app_module --> admin_module : importe
app_module --> cours_module : importe
app_module --> shared_module : importe

note right of app_module : Module racine de l'application
note right of routing_module : Configuration des routes
note right of auth_module : Authentification et autorisation
note right of admin_module : Fonctionnalités administratives
note right of cours_module : Gestion des cours
note right of shared_module : Composants et services partagés

@enduml
```

## Description du diagramme

Ce diagramme illustre l'organisation modulaire de l'application Angular, montrant comment les différents modules s'articulent autour du module principal (AppModule). Cette architecture modulaire permet une meilleure séparation des préoccupations et une maintenance plus facile du code.
