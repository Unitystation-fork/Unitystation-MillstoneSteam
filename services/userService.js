// services/userService.js
import { checkDiscordUserExistence } from '~/models/User';

export const isDiscordUserExists = async (discordUsername) => {
  const user = await checkDiscordUserExistence(discordUsername);
  return !!user; // Retourne true si l'utilisateur existe, sinon false
};