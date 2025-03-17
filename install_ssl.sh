#!/bin/bash

# Définition des couleurs pour les messages
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"

echo -e "${GREEN}🔹 Activation de HTTPS sur Apache (Debian) 🔹${RESET}"

# Vérifier si l'utilisateur est root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root.${RESET}"
   exit 1
fi

# Demander le nom de domaine
read -p "🔹 Entrez le nom de domaine (ex: monsite.com) : " DOMAIN

if [[ -z "$DOMAIN" ]]; then
    echo -e "${RED}❌ Aucun domaine saisi. Script annulé.${RESET}"
    exit 1
fi

# Vérifier et installer Certbot si absent
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}🛠️ Installation de Certbot...${RESET}"
    apt update && apt install -y certbot python3-certbot-apache
else
    echo -e "${GREEN}✅ Certbot est déjà installé.${RESET}"
fi

# Générer le certificat SSL avec Certbot
echo -e "${YELLOW}🔹 Obtention du certificat SSL pour $DOMAIN...${RESET}"
certbot --apache -d "$DOMAIN"

if [[ $? -ne 0 ]]; then
    echo -e "${RED}❌ Échec de la génération du certificat. Vérifiez que votre domaine pointe bien vers ce serveur.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Certificat SSL installé avec succès !${RESET}"

# Vérifier si le renouvellement automatique est actif
echo -e "${YELLOW}🔹 Vérification du renouvellement automatique...${RESET}"
if systemctl list-timers | grep -q certbot; then
    echo -e "${GREEN}✅ Le renouvellement automatique du certificat SSL est actif.${RESET}"
else
    echo -e "${RED}❌ Le renouvellement automatique n'est pas activé ! Ajoutons-le...${RESET}"
    systemctl enable certbot.timer
    systemctl start certbot.timer
    echo -e "${GREEN}✅ Le renouvellement automatique est maintenant activé.${RESET}"
fi

# Redémarrer Apache pour appliquer les changements
echo -e "${YELLOW}🔄 Redémarrage d'Apache...${RESET}"
systemctl restart apache2

echo -e "${GREEN}🎉 HTTPS activé et renouvellement automatique configuré pour $DOMAIN ! ${RESET}"
echo -e "${GREEN}🔗 Testez votre site en HTTPS : https://$DOMAIN ${RESET}"
