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

Avant de cloner le projet, assurez-vous d'avoir installé [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) avec une version minimale de 22.22.3 (exigence de Nuxt 4).

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

## S'ajouter en ADMIN localement


Voici les étapes à suivre pour se connecter en tant qu'administrateur :


1. Copier le fichier d'exemple avec la commande `cp .env.example .env` puis le remplir avec un nom d'utilisateur, un mot de passe admin en clair et un `JWT_SECRET`.


2. Exécuter la commande `npx prisma migrate deploy` pour créer la base de données.


3. `npx prisma db seed` pour injecter les données dans la base de données, dont cet utilisateur avec le rôle admin. Son mot de passe est haché avant d'être écrit.


4. Ensuite, exécuter `npx prisma studio` pour vérifier que l'utilisateur a bien été créé.

  
## Variables d'environnement

Elles se règlent dans le fichier `.env` (modèle : `.env.example`) :

| Variable | Rôle |
| --- | --- |
| `JWT_SECRET` | Secret de signature des jetons de session |
| `ADMIN_NAME`, `ADMIN_PASSWORD` | Compte administrateur créé par `node prisma/seed.js` (mot de passe en clair, haché par le seed) |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_CLIENT_REDIRECT` | Application Discord pour la connexion Discord (l'URL de redirection doit être déclarée à l'identique chez Discord) |
| `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `TWITCH_CLIENT_REDIRECT` | Idem pour Twitch |

Nuxt ne prend dans sa configuration que les variables `NUXT_*` : `docker-compose.yml` recopie donc les variables `DISCORD_*` et `TWITCH_*` vers les variables `NUXT_*` (`NUXT_PUBLIC_DISCORD_CLIENT_ID`, `NUXT_DISCORD_CLIENT_SECRET`, etc.) que Nuxt lit au démarrage. Les secrets restent côté serveur : l'échange du code OAuth se fait dans `/api/oauth/discord` et `/api/oauth/twitch`, jamais dans le navigateur.

Si les variables sont gérées dans l'Environment de la stack Komodo, `DISCORD_*` et `TWITCH_*` doivent y figurer : Komodo écrit alors le `.env` lui-même.

## Tests

Aucun appel n'est fait aux vrais services : `tests/fake-oauth.mjs` simule Discord et Twitch (port 4500) et le site tourne sur le port 3000 (les deux doivent être libres). Les scripts ne touchent jamais à `prisma/milestone.db` (le fichier monté par la prod) : ils copient le dépôt dans un dossier temporaire (`mktemp -d`, sans la base, `.output`, `.nuxt`, `.env` ni `tests/.tmp`; `node_modules` y est copié pour de bon, 300 Mo environ, son contenu est recopié même si `node_modules` est un lien symbolique, jamais relié, sinon `prisma generate` réécrirait le client du vrai dépôt ; `rsync` est requis), puis migrent, remplissent la base de test, construisent et testent dans cette copie, supprimée à la sortie. Deux lancements ne se gênent donc pas sur les fichiers ; ils se refusent seulement si les ports 3000 ou 4500 sont déjà pris. Après un `kill -9`, il reste un dossier orphelin dans `/tmp` (environ 350 Mo : `node_modules` et `.output`), jamais dans le dépôt : à supprimer à la main (`/tmp/tmp.*`).

- `bash tests/run-local.sh` : build, base de test, faux OAuth, serveur Nitro, puis `tests/api.test.mjs` (Node 20+, `rsync` installé).
- `bash tests/run-docker.sh` : même chose avec l'image Docker, via `tests/compose.test.yml` et `tests/test.env` (valeurs factices qui testent l'interpolation de `docker-compose.yml`), projet `millstone-test`, conteneur `app-test`, sans traefik.
- `tests/browser.mjs` : parcours navigateur Playwright. Il tourne à la suite des deux scripts ci-dessus si la variable `PW_DIR` (dossier où Playwright est installé : `package.json` et `node_modules/playwright`) est définie (les captures vont dans `SHOTS`, par défaut un dossier `mktemp -d` affiché en fin de run, conservé après la sortie) ; il peut aussi être lancé seul contre un site déjà démarré (`BASE_URL`, par défaut `http://127.0.0.1:3000`, dont la redirect attendue est déduite).

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
cp .env.example .env
nano .env # Mettez à jour les valeurs (le mot de passe s'écrit en clair, il est haché avant d'être écrit en base)
touch prisma/milestone.db
docker compose --profile migrate run --build --rm migrate
docker compose --profile migrate run --rm migrate npx prisma db seed # Pour peupler la base de données avec l'utilisateur Administrateur que vous avez indiqué dans .env
docker compose up -d --build app
```

Une fois le compte créé, `ADMIN_PASSWORD` n'est plus lu et peut être retiré de `.env`.

### Mise à jour du projet (après une nouvelle version) :

```bash

cd /usr/local/src/Unitystation-MillstoneSteam/
docker compose down
git pull
docker compose up -d --build
```

### Migrations en production

L'image finale ne contient pas Prisma, et la commande `prisma migrate deploy` du Dockerfile ne touche qu'une copie de la base, recouverte au démarrage par `prisma/milestone.db`. Une version qui ajoute une migration doit donc être appliquée à la vraie base :

```bash

cd /usr/local/src/Unitystation-MillstoneSteam/
docker compose stop app
cp -a prisma/milestone.db prisma/milestone.db.avant-migration
docker compose --profile migrate run --build --rm migrate
docker compose up -d --build app
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
