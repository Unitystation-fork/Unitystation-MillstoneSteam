<!-- <script setup>
const passport = require('passport');
const { Strategy } = require('passport-discord');

passport.use(
    new Strategy({
        clientID: '1057597168506126397',
        clientSecret: 'w4bUTDxYAUupRZrB3NewQUhRgqO0Lm7Z',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify'],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Jetons d\'accès OAuth2 :', accessToken);
        console.log('Jeton de rafraîchissement :', refreshToken);
        console.log('Profil Discord de l\'utilisateur :', profile);
    })
);
</script>
   -->