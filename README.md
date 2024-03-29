# MillstoneSteam

![forthebadge](https://forthebadge.com/images/badges/cc-nc-sa.svg)

## Sommaire

- [Présentation](#présentation)
- [Langages utilisés](#langages-utilisés)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Contribution](#contribution)

## Présentation

Le projet MillstoneSteam a pour objectif d'offrir un suivi continu des avancées de projets menés par l'Union des Rôlistes autour du jeu UnityStation, et par la suite d'autres projets.

## Langages utilisés

Le projet fonctionne avec le framework fullstack [Nuxt.js](https://v3.nuxtjs.org/) et l'ORM [Prisma](https://www.prisma.io/) avec une base de données SQLite.

## Installation

### Dépendances

Avant de cloner le projet, assurez-vous d'avoir installé [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) avec une version minimale de 18.

Pour installer les dépendances, utilisez l'une des commandes suivantes :

```bash
# Utilisation de yarn
yarn install

# Utilisation de npm
npm install

# Utilisation de pnpm
pnpm install --shamefully-hoist
```
## Activation de Prisma

Pour activer Prisma il faut utiliser la commande :

```bash
npx prisma generate
```

## Démarrage du serveur de développement

Pour lancer le serveur de développement, utilisez la commande suivante :

```bash

npm run dev
```
Accédez à http://localhost:3000/ dans votre navigateur pour accéder au serveur de développement.

Pour construire l'application en mode production, utilisez :

```bash

npm run build
```

Pour obtenir un aperçu de la version de production, utilisez :

```bash

npm run preview
```

Pour accéder à l'aperçu de la version de production, visitez http://milestone.unionrolistes.fr:3000/ dans votre navigateur.

## Installation sur un serveur de production (PROD)

Après la connexion au serveur d'hébergement, suivez ces étapes pour installer le projet :

### Mise à jour du système :

```bash

sudo apt update
sudo apt upgrade -y
sudo apt-get install ca-certificates curl gnupg -y
```

### Installation de Docker :

``` bash

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \$(. /etc/os-release && echo "\$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Configuration de Docker :

```bash

sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

### Clonage du projet et configuration :

```bash

cd /usr/local/src
git clone https://github.com/Unitystation-fork/Unitystation-MillstoneSteam.git
cd ./Unitystation-MillstoneSteam
cp .default .env
nano .env # Mettez à jour les valeurs (le mot de passe doit être au format bcrypt. Vous pouvez convertir votre mot de passe en hash bcrypt ici : https://www.bcrypt.fr/)
node seed.js # Pour peupler la base de données avec l'utilisateur Administrateur que vous avez indiquez dans .env
docker compose up
```

### Mise à jour du projet (après une nouvelle version) :

```bash

cd /usr/local/src/Unitystation-MillstoneSteam/
docker down
git pull
docker up
```

### Utilisation

#### Crédit, Participants, Organisation

- Géré par l'équipe de développement de Unionrolistes
- Liste des contributeurs : [Credit.md](https://github.com/Unitystation-fork/Unitystation-MillstoneSteam/blob/main/Credit.md)
- Licence : [Licence.md](https://github.com/Unitystation-fork/Unitystation-MillstoneSteam/blob/main/LICENSE)

#### But du Projet / Public Cible

**Pour le Public Participant :**

- Mise en avant de la progression du développement.
- Consultation des points, comme une annonce de progression vers l'objectif final.

Par exemple, dans notre cas présent, un stream collaboratif avec d'autres streamers/joueurs pré-sélectionnés pour une session live RP avec vocal.

**Mode Viewer :**

Pouvoir consulter, de manière simple, les points dans la progression :

- Ceux réalisés seraient sur le côté gauche et légèrement compressés.
- Ceux sur le côté droit seront "prochainement" réalisés.

**Mode Admin :**

- Pouvoir ajouter, supprimer, modifier l'état des points "milestone".

#### Usage

**Options pour le ou les Admins :**

- Bouton de connexion / déconnexion
  - Permet de rentrer les informations de connexion
- (Si connecté) peut ajouter, modifier ou supprimer des tâches présentes pour le projet

**Options pour les Autres Utilisateurs :**

- Lecture sur la barre de progression et les différentes tâches (ne peuvent rien modifier)
- Les utilisateurs peuvent se connecter en utilisant Discord ou Twitch.  



## Contribution

Nous encourageons toute contribution à l'amélioration de ce projet. Si vous souhaitez contribuer, veuillez suivre ces étapes :

1. Clonez le projet sur votre machine.
2. Créez une branche spécifique pour votre implémentation afin de ne pas perturber le travail existant.
3. Effectuez vos modifications et assurez-vous de tester soigneusement.
4. Créez une issue pour décrire votre contribution. Assurez-vous que le numéro de l'issue soit unique.
5. Soumettez une demande de pull request en utilisant le même numéro que celui de l'issue, pour que nous examinions vos modifications.

Nous sommes ouverts aux idées et aux améliorations, alors n'hésitez pas à participer et à aider à faire avancer ce projet. Vous trouverez également des tâches à réaliser dans notre liste "ToDo" : [TODO](https://github.com/orgs/Unitystation-fork/projects/1/views/4?visibleFields=%5B%22Repository%22%2C20977185%2C%22Title%22%2C%22Labels%22%2C%22Assignees%22%2C%22Status%22%5D).
