import { googleAuthChannel, spotifyAuthChannel } from "@shared/channels";
import { googleOAuthClient } from "@shared/context";
import { Provider } from "@shared/validations";
import { Env } from "@src/env";
import { publicProcedure, router } from "@src/trpc";
import { observable } from "@trpc/server/observable";
import { Micro } from "effect";
import { shell } from "electron";
import { z } from "zod";

export const oauth = router({
    attemptOAuth: publicProcedure
        .input(
            z.object({
                provider: Provider,
            }),
        )
        .mutation(async ({ input }) =>
            Micro.runPromise(handleOAuth(input.provider)).then((res) => res)
        ),
    awaitOAuthAttempt: publicProcedure.subscription(() =>
        observable<{ provider: Provider; successful: boolean }>((emit) => {
            // await success from redirect server for spotify
            spotifyAuthChannel.onmessage = (e) => {
                emit.next({
                    provider: "spotify",
                    successful: true,
                });
            };

            // await success from redirect server for spotify
            googleAuthChannel.onmessage = async (e) => {
                const { tokens } = await googleOAuthClient.getToken(e.code);
                googleOAuthClient.setCredentials(tokens);
                emit.next({
                    provider: "youtube",
                    successful: true,
                });
            };

            return () => {
                googleAuthChannel.removeEventListener("message", () => {
                    return;
                });
                spotifyAuthChannel.removeEventListener("message", () => {
                    return;
                });
            };
        })
    ),
});

function handleOAuth(provider: Provider) {
    return Micro.tryPromise({
        try: async () => {
            switch (provider) {
                case "spotify": {
                    const searchParams = new URLSearchParams({
                        response_type: "code",
                        client_id: Env.SPOTIFY_CLIENT_ID,
                        scope: encodeURIComponent(
                            "user-read-private user-read-email",
                        ),
                        redirect_uri: encodeURIComponent(
                            "http://localhost:42069/callback",
                        ),
                        state: "turntables",
                        show_dialog: "true",
                    });

                    const url = new URL(
                        `https://accounts.spotify.com/authorize?${searchParams.toString()}`,
                    );

                    shell.openExternal(url.toString());
                    return;
                }
                case "youtube": {
                    const url = googleOAuthClient.generateAuthUrl({
                        client_id: Env.GOOGLE_CLIENT_ID,
                        access_type: "offline",
                        scope: Env.GOOGLE_AUTH_SCOPES.split(","),
                        response_type: "code",
                        redirect_uri: "http://localhost:42069/googleredirect",
                    });

                    shell.openExternal(url);

                    return;
                }
            }
        },
        catch: (e) => new Error(String(e)),
    }).pipe(
        Micro.tapError((e) =>
            Micro.sync(() => console.log(e.name, e.cause, e.message))
        ),
        Micro.catchAll((e) => Micro.sync(() => console.log(e))),
    );
}
