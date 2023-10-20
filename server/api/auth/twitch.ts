import express from "express";
import passport from "passport";
import TwitchStrategy from "passport-twitch-new";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

passport.use(
    new TwitchStrategy(
        {
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: process.env.TWITCH_CLIENT_REDIRECT,
            scope: "user:read:email",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const twitchId = profile.id;
                const user = await prisma.user.findFirst({
                    where: { twitchId },
                });

                if (user) {
                    console.log("Utilisateur déjà inscrit.")
                } else {
                    await prisma.user.create({
                        data: {
                            twitchId,
                        },
                    });
                }

                // redirection ?
                done(null, user);
            } catch (error) {
                console.error(error);
            }
        }
    )
);

router.get("/login", passport.authenticate("twitch"));

router.get(
    "/redirect",
    passport.authenticate("twitch", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
    }
);

export default router;