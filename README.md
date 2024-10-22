# railroad-finalproject

## Description

Ce projet est une API pour la gestion des chemins de fer. Il permet de gérer les stations, les trains et les horaires de départ et d'arrivée. L'API est construite avec Node.js, Express, et MongoDB, et utilise Swagger pour la documentation.

## Prérequis

- Node.js
- MongoDB

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/alexandre-juillard/railroad-finalproject.git
cd railroad-finalProject
```

## Installation des dépendances

`npm install`

## Configurer les variables d'environnement : Créer un fichier `.env` à la racine du projet et ajouter les variables suivantes :

```bash
PORT=3000
MONGODB_URI=mongodb+srv://votre-utilisateur:votre-mot-de-passe@votre-cluster.mongodb.net/votre-base-de-donnees
JWT_SECRET=your_jwt_secret
```

## Démarrage du serveur

Pour démarrer le serveur en mode développement avec `nodemon` :

`nodemon server`

Pour démarrer le serveur en mode production : 

`node server`

## Documentation de l'API

La documentation Swagger de l'API est disponible à l'URL suivante après avoir démarré le serveur :

`http://localhost:3000/api-docs`

## Utilisation

Routes principales

- Utilisateurs
    - `POST /users/register` : Inscription de l'utilisateur
    - `POST /users/login` : Connexion de l'utilisateur
    - `GET /users` : Lister les utilisateurs
    - `GET /users/{id}` : Voir un utilisateur par ID
    - `PUT /users/{id}` : Modifier un utilisateur par ID
    - `DELETE /users/{id}` : Supprimer un utilisateur par ID

- Gares
    - `GET /stations` : Récupérer toutes les stations
    - `POST /stations` : Créer une nouvelle station
    - `GET /stations/:id` : Récupérer une station par ID
    - `PUT /stations/:id` : Mettre à jour une station par ID
    - `DELETE /stations/:id` : Supprimer une station par ID

- Trains
    - `GET /trains` : Récupérer tous les trains
    - `POST /trains` : Créer un nouveau train
    - `GET /trains/:id` : Récupérer un train par ID
    - `PUT /trains/:id` : Mettre à jour un train par ID
    - `DELETE /trains/:id` : Supprimer un train par ID
 
- Billets
    - `POST /tickets/create` : Créer un billet de transport
    - `POST /tickets/validate` : Valider un billet de transport
    - `GET /tickets/user-tickets` : Voir les billets existants d'un utilisateur connecté
    - `GET /tickets/:id/check-validation` : Vérifier la validité d'un ticket

## Tests

Pour exécuter les tests, utiliser la commande suivante :

`npm test`

Bonne lecture !
