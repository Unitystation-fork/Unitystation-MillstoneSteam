import passport from 'passport';
import './api/auth/discord';
import './api/auth/twitch';

export default function usePassport(app) {
    app.use(passport.initialize());
}
