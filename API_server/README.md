
# API_SERVER - Guide d'utilisation

Ce dossier contient le serveur d'API pour le projet WE4A-SI40.

## Prérequis

- Accès à la base de données (vérifiez la configuration dans le code)

## Démarrage du serveur

1. Placez vous dans le dossier `API_server` depuis votre terminal (cd API_server).
2. Lancez la commande : npm start


## Structure du dossier

- `index.php` : Point d'entrée principal de l'API.
- `config/` : Fichiers de configuration (ex : connexion à la base de données).
- `routes/` : Définit les routes/endpoints de l'API.
- `controllers/` : Logique métier pour chaque endpoint.
- `models/` : Accès aux données et gestion des entités.

## Utilisation de l'API

### Exemple de requête

Pour interroger l'API, utilisez un outil comme Postman ou `curl`.

**Exemple :**

```
GET http://localhost/Projet_WE4A-SI40/API_server/users
```

**Réponse attendue :**
```json
[
  {
    "id": 1,
    "name": "Alice"
  },
  "..."
]
```

### Endpoints disponibles

- `/users` : Liste des utilisateurs
- `/users/{id}` : Détail d'un utilisateur
- `/login` : Authentification
- (Ajoutez ici la liste complète des endpoints selon votre projet)

## Fonctionnement interne

1. Le serveur reçoit une requête HTTP.
2. La route correspondante est identifiée dans le dossier `routes/`.
3. Le contrôleur associé traite la requête et interagit avec les modèles si besoin.
4. Une réponse JSON est renvoyée au client.

## Conseils

- Modifiez la configuration de la base de données dans `config/database.php` si besoin.
- Pour ajouter un nouvel endpoint, créez un fichier dans `controllers/` et référencez-le dans `routes/`. Et créez le modèle associé dans `models/`.


