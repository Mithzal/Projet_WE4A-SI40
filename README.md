# Projet WE4A-SI40

Ce projet est une plateforme éducative inspirée par Moodle, développée avec Angular (version 13.3.3) pour le frontend et Node.js pour l'API backend.

## Structure du projet

Le projet est organisé en deux parties principales :

- **Frontend (Angular)** : Contient l'interface utilisateur avec tous les composants et services nécessaires
- **API_server** : Contient le backend Node.js avec les routes et contrôleurs pour la gestion des données

### Structure des dossiers

- `/src` : Code source du frontend Angular
  - `/app` : Composants de l'application
  - `/models` : Modèles de données TypeScript
  - `/assets` : Ressources statiques (images, icônes, etc.)
- `/API_server` : Code source du backend
  - `/controllers` : Logique métier
  - `/models` : Schémas de données MongoDB
  - `/routes` : Définition des points d'API
  - `/middleware` : Middlewares (authentification, etc.)

## Installation

### Prérequis

- Node.js (v14.x ou supérieur)
- Angular CLI (`npm install -g @angular/cli@13.3.3`)
- MongoDB (v4.x ou supérieur)

### Installation du frontend

```bash
# Se positionner dans le répertoire du projet
cd Projet_WE4A-SI40

# Installer les dépendances
npm install
```

### Installation du backend (API)

```bash
# Se positionner dans le répertoire de l'API
cd API_server

# Installer les dépendances
npm install

# Installer nodemon pour le développement
npm install -g nodemon
```

## Démarrage de l'application

### Frontend Angular

```bash
# Depuis le dossier racine du projet
ng serve
```

Naviguez ensuite vers `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez les fichiers sources.

### API Backend

```bash
# Depuis le dossier API_server
npm start
# Ou avec nodemon
nodemon server.js
```

L'API sera disponible sur `http://localhost:7777/`. (Il n'y a pas de page d'accueil pour l'API, mais vous pouvez tester les routes avec Postman ou un autre outil similaire.)

> **Note** : Un README détaillé pour l'API est disponible dans le dossier `API_server`. Consultez-le pour plus d'informations sur les routes disponibles et les exemples d'utilisation.

## Fonctionnalités disponibles

- Système d'authentification (étudiants, professeurs, administrateurs)
- Gestion des cours et unités d'enseignement
- Forums de discussion pour chaque cours
- Système de téléchargement/upload de fichiers
- Gestion des notes
- Tableau de bord personnalisé

## Commandes Angular

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
