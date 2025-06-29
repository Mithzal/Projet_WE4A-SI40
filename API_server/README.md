# API_SERVER - Guide d'utilisation

Ce dossier contient le serveur d'API pour le projet WE4A-SI40.

## Prérequis

- Accès à la base de données (vérifiez la configuration dans le .env)

## Installation

1. Placez vous dans le dossier `API_server` depuis votre terminal (cd API_server).
2. Installez les dépendances : `npm install`
3. Pour installer nodemon (redémarrage automatique du serveur) : `npm install -g nodemon`

## Démarrage du serveur

1. Placez vous dans le dossier `API_server` depuis votre terminal (cd API_server).
2. Lancez la commande : `npm start`
3. Ou avec nodemon : `nodemon server.js`


## Structure du dossier

- `server.js` : Point d'entrée principal de l'API.
- `config/` : Fichiers de configuration (ex : connexion à la base de données).
- `routes/` : Définit les routes/endpoints de l'API.
- `controllers/` : Logique métier pour chaque endpoint.
- `models/` : Accès aux données et gestion des entités.

## Utilisation de l'API

### Routes disponibles

#### Utilisateurs
- `GET /api/users` : Récupérer tous les utilisateurs
- `GET /api/users/:id` : Récupérer un utilisateur par son ID
- `POST /api/users` : Créer un nouvel utilisateur
- `PUT /api/users/:id` : Mettre à jour un utilisateur
- `DELETE /api/users/:id` : Supprimer un utilisateur
- `POST /api/users/login` : Authentification d'un utilisateur

#### UE (Unités d'Enseignement)
- `GET /api/ues` : Récupérer toutes les UEs
- `GET /api/ues/:id` : Récupérer une UE par son ID
- `POST /api/ues` : Créer une nouvelle UE
- `PUT /api/ues/:id` : Mettre à jour une UE
- `DELETE /api/ues/:id` : Supprimer une UE

#### Forums
- `GET /api/forums` : Récupérer tous les forums
- `GET /api/forums/:id` : Récupérer un forum par l'ID du cours
- `POST /api/forums` : Créer un nouveau forum
- `PUT /api/forums/:id` : Mettre à jour un forum
- `DELETE /api/forums/:id` : Supprimer un forum
- `PUT /api/forums/:id/addMessages` : Ajouter un message à un forum
- `GET /api/forums/:id/messages` : Récupérer les messages d'un forum

#### Notes
- `GET /api/notes` : Récupérer toutes les notes
- `GET /api/notes/:id` : Récupérer une note par son ID
- `POST /api/notes` : Créer une nouvelle note
- `PUT /api/notes/:id` : Mettre à jour une note
- `DELETE /api/notes/:id` : Supprimer une note

#### Fichiers
- `GET /api/fichiers` : Récupérer tous les fichiers
- `GET /api/fichiers/:id` : Récupérer un fichier par son ID
- `POST /api/fichiers` : Téléverser un nouveau fichier
- `DELETE /api/fichiers/:id` : Supprimer un fichier

#### Logs
- `GET /api/logs` : Récupérer tous les logs
- `POST /api/logs` : Créer un nouveau log

### Exemple de requête

Pour interroger l'API, utilisez un outil comme Postman ou `curl`.

**Exemple :**

```
GET http://localhost:7777/api/logs
```

**Réponse attendue :**
```json
[
  {
    "level": "info",
    "message": "Utilisateur connecté",
    "source": "auth-service",
    "timestamp": "2023-10-01T12:00:00Z",
    "metadata": {
      "userId": "123456",
      "browser": "Chrome"
    }
  }
]
```

**Exemple d'authentification :**

```
POST http://localhost:7777/api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse attendue :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ROLE_USER"
  }
}
```
