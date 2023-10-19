import express from "express";
import passport from "passport";
import DiscordStrategy from "passport-discord";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CLIENT_REDIRECT,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const discordId = profile.id;
                const user = await prisma.user.findFirst({
                    where: { discordId },
                });

                if (user) {
                    console.log("Utilisateur déjà inscrit.")
                } else {
                    await prisma.user.create({
                        data: {
                            discordId,
                        },
                    });
                }
                done(null, user);
            } catch (error) {
                console.error(error);
            }
        }
    )
);

router.get("/login", passport.authenticate("discord"));

router.get(
    "/redirect",
    passport.authenticate("discord", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
    }
);

export default router;
