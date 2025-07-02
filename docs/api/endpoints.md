# Documentation des Endpoints API

## Vue d'ensemble des Endpoints API

| Catégorie | Méthode | Endpoint | Description | Authentification |
|-----------|---------|----------|-------------|------------------|
| **Utilisateurs** |
| | POST | /api/users/login | Authentification d'un utilisateur | Non |
| | GET | /api/users/ | Liste de tous les utilisateurs | Oui |
| | POST | /api/users/ | Création d'un utilisateur | Oui |
| | PUT | /api/users/:id | Mise à jour d'un utilisateur | Oui |
| | DELETE | /api/users/:id | Suppression d'un utilisateur | Oui |
| | PUT | /api/users/enroll/:id/:courseId | Inscrire un utilisateur à un cours | Oui |
| | PUT | /api/users/lastAccess/:id/:courseId | Mettre à jour le dernier accès à un cours | Oui |
| | GET | /api/users/teachers | Liste des enseignants | Oui |
| | GET | /api/users/students | Liste des étudiants | Oui |
| | GET | /api/users/:id/courses | Liste des cours d'un utilisateur | Oui |
| | GET | /api/users/:id/name | Obtenir le nom d'un utilisateur par ID | Oui |
| | GET | /api/users/byUe/:ueId | Liste des utilisateurs inscrits à une UE | Oui |
| | POST | /api/users/logout | Déconnexion d'un utilisateur | Oui |
| **UEs (Cours)** |
| | GET | /api/ues/ | Liste de tous les cours | Non |
| | GET | /api/ues/admin/ | Liste des cours (pour administration) | Oui |
| | POST | /api/ues/ | Création d'un cours | Oui |
| | PUT | /api/ues/:id | Mise à jour d'un cours | Oui |
| | DELETE | /api/ues/:id | Suppression d'un cours | Oui |
| | POST | /api/ues/assignement/submit/:ueId/:contentId | Soumettre un devoir | Oui |
| | GET | /api/ues/assignement/user/:ueId/:contentId/:userId | Récupérer le devoir d'un utilisateur | Oui |
| | DELETE | /api/ues/assignement/delete/:ueId/:contentId/:returnId | Supprimer un devoir | Oui |
| | GET | /api/ues/name/:id | Obtenir le nom d'une UE par ID | Oui |
| | GET | /api/ues/:id | Obtenir les données d'une UE par ID | Oui |
| | POST | /api/ues/content/:id | Ajouter du contenu à une UE | Oui |
| | DELETE | /api/ues/content/:ueId/:contentId | Supprimer du contenu d'une UE | Oui |
| | POST | /api/ues/consult/:id | Enregistrer une consultation d'UE | Oui |
| **Forums** |
| | GET | /api/forums/ | Liste de tous les forums | Oui |
| | POST | /api/forums/ | Création d'un forum | Oui |
| | PUT | /api/forums/:id | Mise à jour d'un forum | Oui |
| | DELETE | /api/forums/:id | Suppression d'un forum | Oui |
| | PUT | /api/forums/:id/addMessages | Ajouter un message à un forum | Oui |
| | GET | /api/forums/:id/messages | Obtenir les messages d'un forum | Oui |
| | GET | /api/forums/:courseId | Obtenir un forum par ID | Oui |
| | PUT | /api/forums/:id/updateTitle | Mettre à jour le titre d'un forum | Oui |
| | GET | /api/forums/byCourse/:courseId | Obtenir tous les forums d'un cours | Oui |
| | DELETE | /api/forums/:forumId/messages/:messageIndex | Supprimer un message d'un forum | Oui |
| **Fichiers** |
| | POST | /api/fichiers/upload | Télécharger un fichier | Oui |
| | GET | /api/fichiers/ | Liste de tous les fichiers | Oui |
| | GET | /api/fichiers/download/:id | Télécharger un fichier | Oui |
| | DELETE | /api/fichiers/delete/:id | Supprimer un fichier | Oui |
| | GET | /api/fichiers/name/:id | Obtenir le nom d'un fichier par ID | Oui |
| **Notes** |
| | GET | /api/notes/ | Liste de toutes les notes | Oui |
| | POST | /api/notes/ | Création d'une note | Oui |
| | PUT | /api/notes/:id | Mise à jour d'une note | Oui |
| | DELETE | /api/notes/:id | Suppression d'une note | Oui |
| | GET | /api/notes/course/:ueId | Obtenir les notes d'un cours | Oui |
| | GET | /api/notes/student/:studentId | Obtenir les notes d'un étudiant | Oui |
| **Logs** |
| | GET | /api/logs/ | Liste de tous les logs | Oui |
| | POST | /api/logs/ | Création d'un log | Oui |
| | PUT | /api/logs/:id | Mise à jour d'un log | Oui |
| | DELETE | /api/logs/:id | Suppression d'un log | Oui |
| | POST | /api/logs/consult-course | Enregistrer une consultation de cours | Oui |

## Notes importantes

1. **Authentification** : La majorité des endpoints nécessitent une authentification via un token JWT qui doit être inclus dans l'en-tête de la requête HTTP.

2. **Format des réponses** : Toutes les réponses sont au format JSON.

3. **Gestion des erreurs** : Les erreurs sont retournées avec un code HTTP approprié et un message d'erreur en JSON.

4. **ID dynamiques** : Les paramètres comme `:id`, `:ueId`, etc., sont des variables qui doivent être remplacées par des identifiants réels lors des appels à l'API.

5. **Middleware de logs** : De nombreuses actions (création, mise à jour, suppression) sont automatiquement journalisées grâce à un middleware de logs.
