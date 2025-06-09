
# API_SERVER - Guide d'utilisation

Ce dossier contient le serveur d'API pour le projet WE4A-SI40.

## Prérequis

- Accès à la base de données (vérifiez la configuration dans le .env)

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
GET http://localhost/Projet_WE4A-SI40/API_server/logs
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

### Endpoints disponibles

- GET '/logs' : Récupère toutes les logs du système.
- POST '/logs' : Crée une nouvelle log. Les paramètres sont passés dans le corps de la requête au format JSON.
- PUT '/logs/{id}' : Met à jour une log existante. Les paramètres à modifier sont passés dans le corps de la requête.
- DELETE '/logs/{id}' : Supprime une log existante.

## Fonctionnement interne

1. Le serveur reçoit une requête HTTP.
2. La route correspondante est identifiée dans le dossier `routes/`.
3. Le contrôleur associé traite la requête et interagit avec les modèles si besoin.
4. Une réponse JSON est renvoyée au client.

## Pour ajouter un nouvel endpoint

- créez un fichier dans `controllers/` 
- Référencez-le dans `routes/`
- Créez le modèle associé dans `models/`
- Ajouter l'utilisation de la route dans server.js


