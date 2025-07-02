# Endpoints API - Format pour diaporama

## Endpoints Utilisateurs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ENDPOINTS UTILISATEURS                          │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ POST    │ /api/users/login                  │ Authentification        │ Non  │
│ GET     │ /api/users/                       │ Liste utilisateurs      │ Oui  │
│ POST    │ /api/users/                       │ Création utilisateur    │ Oui  │
│ PUT     │ /api/users/:id                    │ Mise à jour utilisateur │ Oui  │
│ DELETE  │ /api/users/:id                    │ Suppression utilisateur │ Oui  │
│ PUT     │ /api/users/enroll/:id/:courseId   │ Inscrire à un cours     │ Oui  │
│ GET     │ /api/users/teachers               │ Liste des enseignants   │ Oui  │
│ GET     │ /api/users/students               │ Liste des étudiants     │ Oui  │
│ GET     │ /api/users/:id/courses            │ Cours d'un utilisateur  │ Oui  │
│ GET     │ /api/users/byUe/:ueId             │ Utilisateurs d'une UE   │ Oui  │
│ POST    │ /api/users/logout                 │ Déconnexion             │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘
```

## Endpoints UEs (Cours)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                               ENDPOINTS UEs/COURS                            │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ GET     │ /api/ues/                         │ Liste des cours         │ Non  │
│ GET     │ /api/ues/admin/                   │ Liste pour admin        │ Oui  │
│ POST    │ /api/ues/                         │ Création cours          │ Oui  │
│ PUT     │ /api/ues/:id                      │ Mise à jour cours       │ Oui  │
│ DELETE  │ /api/ues/:id                      │ Suppression cours       │ Oui  │
│ POST    │ /api/ues/assignement/submit/:ueId │ Soumettre devoir        │ Oui  │
│ GET     │ /api/ues/name/:id                 │ Nom UE par ID           │ Oui  │
│ GET     │ /api/ues/:id                      │ Données UE par ID       │ Oui  │
│ POST    │ /api/ues/content/:id              │ Ajouter contenu UE      │ Oui  │
│ DELETE  │ /api/ues/content/:ueId/:contentId │ Supprimer contenu UE    │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘
```

## Endpoints Forums

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ENDPOINTS FORUMS                                │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ GET     │ /api/forums/                      │ Liste des forums        │ Oui  │
│ POST    │ /api/forums/                      │ Création forum          │ Oui  │
│ PUT     │ /api/forums/:id                   │ Mise à jour forum       │ Oui  │
│ DELETE  │ /api/forums/:id                   │ Suppression forum       │ Oui  │
│ PUT     │ /api/forums/:id/addMessages       │ Ajouter message         │ Oui  │
│ GET     │ /api/forums/:id/messages          │ Messages d'un forum     │ Oui  │
│ GET     │ /api/forums/:courseId             │ Forum par ID            │ Oui  │
│ PUT     │ /api/forums/:id/updateTitle       │ Mettre à jour titre     │ Oui  │
│ GET     │ /api/forums/byCourse/:courseId    │ Forums d'un cours       │ Oui  │
│ DELETE  │ /api/forums/:forumId/messages/:i  │ Supprimer message       │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘
```

## Endpoints Fichiers, Notes et Logs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ENDPOINTS FICHIERS                              │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ POST    │ /api/fichiers/upload              │ Télécharger fichier     │ Oui  │
│ GET     │ /api/fichiers/                    │ Liste des fichiers      │ Oui  │
│ GET     │ /api/fichiers/download/:id        │ Télécharger fichier     │ Oui  │
│ DELETE  │ /api/fichiers/delete/:id          │ Supprimer fichier       │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                               ENDPOINTS NOTES                                │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ GET     │ /api/notes/                       │ Liste des notes         │ Oui  │
│ POST    │ /api/notes/                       │ Création note           │ Oui  │
│ PUT     │ /api/notes/:id                    │ Mise à jour note        │ Oui  │
│ DELETE  │ /api/notes/:id                    │ Suppression note        │ Oui  │
│ GET     │ /api/notes/course/:ueId           │ Notes d'un cours        │ Oui  │
│ GET     │ /api/notes/student/:studentId     │ Notes d'un étudiant     │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                                ENDPOINTS LOGS                                │
├─────────┬───────────────────────────────────┬─────────────────────────┬──────┤
│ MÉTHODE │ ENDPOINT                          │ DESCRIPTION             │ AUTH │
├─────────┼───────────────────────────────────┼─────────────────────────┼──────┤
│ GET     │ /api/logs/                        │ Liste des logs          │ Oui  │
│ POST    │ /api/logs/                        │ Création log            │ Oui  │
│ PUT     │ /api/logs/:id                     │ Mise à jour log         │ Oui  │
│ DELETE  │ /api/logs/:id                     │ Suppression log         │ Oui  │
│ POST    │ /api/logs/consult-course          │ Consultation cours      │ Oui  │
└─────────┴───────────────────────────────────┴─────────────────────────┴──────┘
```
