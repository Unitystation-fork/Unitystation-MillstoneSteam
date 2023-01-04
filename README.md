[![forthebadge](https://forthebadge.com/images/badges/cc-nc-sa.svg)](https://forthebadge.com)
## OnePage MillstoneSteam

Objectif Stream coop

OnePage MillstoneSteam  
├── [Langages utilisés](#langages-utilisés)  
├── [Description du projet](#description-du-projet)  
├── [Credit , participant, organisation](#credit--participant-organisation)  
├── [But du projet / public cible](#but-du-projet--public-cible)  
│....├── [Mode Viewer](#mode-viewer)  
│....└── [Mode Admin](#mode-admin)  
├── [Installation](#installation)  
│....├── [Dépendances](#dépendances)  
│....├── [Démarrez ensuite le serveur de développement :](#démarrez-ensuite-le-serveur-de-développement)  
│....└── [PROD](#prod)  
├── [Mise à jour](#mise-à-jour)  
├── [Usage](#usage)  
│....├── [Options pour le ou les admins :](#options-pour-le-ou-les-admins)  
│....└── [Options pour les autres utilisateurs :](#options-pour-les-autres-utilisateurs)  
└── [ToDo](#todo)  
....├── [Prototype visuel](#prototype-visuel)  
....└── [Liste des taches](#liste-des-taches)  

### Langages utilisés

- Le projet fonctionne avec le framework fullstack [NuxtJs](https://v3.nuxtjs.org/) + l'ORM [Prisma](https://www.prisma.io/) + une base de données en SQLite

-------------

### Description du projet

- Le projet MillstoneSteam a pour objectif d'offrir un suivi continuel des avancées de projets menés par l'Union des Rôlistes autour du  jeu UnityStation, et par la suite d'autres projets.

-------------

### Credit , participant, organisation

- Géré par l'équipe de développement de Unionrolistes

- Liste des contributeur ! [Credit.md](https://github.com/Unitystation-fork/Unitystation-MillstoneSteam/blob/main/Credit.md)

- ! [Licence.md](https://github.com/Unitystation-fork/Unitystation-MillstoneSteam/blob/main/LICENSE)

-------------

### But du projet / public cible

Pour le public participant :

    Mise en avant de la progressions  du développement
    Consultation des points, comme une annonce de progression vers l'objectif final

Par exemple, dans notre cas présent, un stream collaboratif avec d'autre streamers/joueurs pre-selectionnés pour une session live RP avec vocal.

#### Mode Viewer

Pouvoir consulter, de manière simple, les points dans la progression :

- Ceux realisés seraient sur le coté gauche et légèrement comrpessés,
- Ceux sur le coté droit, seront "prochainement" réalisés.

#### Mode Admin

- Pouvoir ajouter, supprimer, modifier l'état des points "millestone"

-------------

### Installation

#### Dépendances

Avant de cloner le projet, assurez-vous d'avoir installé [NodeJs](
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
) au préalable.

Pour installer les dépendances :

```console
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

#### Démarrez ensuite le serveur de développement

```bash
npm run dev
```

Pour builder l'application en mode production :

```bash
npm run build
```

Pour avoir un preview de la version prod :

```bash
    npm run preview
```

#### PROD

Apres connexion au serveur hebergeur
aller dans le dossier
cd /xxxx

-------------

### Mise à jour

- Pour contribuer au projet, clonez le sur votre machine.
**Ensuite**, assurez-vous de créer une branche spécifique à ce que vous souhaitez implémanter afin de ne pas casser ce qui est déjà en place.

-------------

### Usage

#### Options pour le ou les admins

- Bouton connexion / déconnexion

    -> Rentrer les informations de connexion

- (si connecté) peut ajouter / modifier / supprimer des tâches présentes pour le projet

#### Options pour les autres utilisateurs

- Lecture sur la barre de progression + les différentes tâches
(ne peut rien modifier)

---

### ToDo

! [TODO](https://github.com/orgs/Unitystation-fork/projects/1/views/4?visibleFields=%5B%22Repository%22%2C20977185%2C%22Title%22%2C%22Labels%22%2C%22Assignees%22%2C%22Status%22%5D)

#### Prototype visuel

![](https://raw.githubusercontent.com/Unitystation-fork/Unitystation-MillstoneSteam/f1c3af75612b74685ed4ea3d72b65f597e01fd62/Images/2022-10-06-163647_1920x1080_scrot.png)

#### Liste des taches

- :page_facing_up:Pitch d'accoche, Pitch Minute
- :page_facing_up:Press-kit
- :discord: Rassembler une base de streamer et joueurs en une liste propre avec Job préférences.
- :discord: Canaux vocaux discord par département/zone
- :page_facing_up:  Préparé une liste de règles et instruction streamer/viewer
- :OBS: Scene streamer avec tuto
- :server: Configuré un serveur local
- :langage_web: Traduire documentation (ajout de loi)
- :question: Niveau Tutoriel Solo
- :question: Tutoriel Français, Anglais, Allemand, Russe

- :discord: Annonces Invitation joueurs
- :calendar: Doodle des participant
- :twitch~1: Stream Entrainement "security"
- :discord: De-Briefing
- :microphone2: Voice Proximity Chat

- :discord: Rôles streamer unitystation
- :discord: Section FR Unitystation

- :discord: Annonces Invitation joueurs
- :calendar: Doodle des participant
- :twitch~1: Stream collaboratif
- :discord: De-Briefing

-------------
