<template>


</template>

<script setup>

// const oauth = new OAuth2Server({
//   model: {
//     async getClient(clientId, clientSecret) {
//       // Vérifiez que le client existe et que le clientSecret est valide
//       const client = await Client.findOne({ clientId, clientSecret });
//       return client;
//     },
//     async grantTypeAllowed(clientId, grantType) {
//       // Vérifiez que le client est autorisé à utiliser le grantType spécifié
//       const client = await Client.findOne({ clientId });
//       return client.grantTypes.includes(grantType);
//     },
//     async getUser(username, password) {
//       // Vérifiez que l'utilisateur existe et que le mot de passe est valide
//       const user = await User.findOne({ username, password });
//       return user;
//     },
//     async saveToken(token, client, user) {
//       // Enregistrez le jeton et retournez-le
//       const accessToken = new AccessToken({ token, client, user });
//       return accessToken.save();
//     }
//   },
//   grants: ['password'],
//   accessTokenLifetime: 3600,
//   refreshTokenLifetime: 604800
// });


const passport = require('passport');
const {Strategy} = require('passport-discord');

passport.use(
    new Strategy({
        clientID: '1057597168506126397',
        clientSecret: 'w4bUTDxYAUupRZrB3NewQUhRgqO0Lm7Z',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope:['identify'],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken, refresh);
    })
);
</script>