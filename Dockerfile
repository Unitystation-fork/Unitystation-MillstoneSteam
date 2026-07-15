# Multi-stage : le stage builder installe toutes les dépendances (y compris
# devDependencies : nuxt, prisma CLI, types) pour générer .output/, un
# bundle Nitro autonome qui embarque déjà ses propres node_modules tracés.
# Le stage final ne copie que .output/ — plus besoin du toolchain de build
# ni des devDependencies (~440MB de npm install jetés une fois le build
# terminé).
FROM node:22-bookworm-slim AS build

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app
RUN npm install

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma migrate status

RUN npm run build

RUN mkdir /app/.output/server/prisma && cp /app/prisma/milestone.db /app/.output/server/prisma/milestone.db


FROM node:22-bookworm-slim

# openssl requis par le moteur Prisma au runtime (mêmes bibliothèques que
# lors du `prisma generate` du stage builder, binaryTargets="native").
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/.output /app/.output

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000 5555

# Appel direct du serveur Nitro déjà construit — pas besoin du CLI nuxt
# (devDependency, absente de ce stage) pour lancer `npm run start`.
CMD ["node", ".output/server/index.mjs"]
