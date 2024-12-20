import { Env } from "@src/env";
import { publicProcedure, router } from "@src/trpc";
import { BroadcastChannel } from "broadcast-channel";
import { Micro } from "effect";
import { shell } from "electron";
import { z } from "zod";
import { googleOAuthClient } from "../context";
import { Provider } from "../validations";

const googleAuthChannel = new BroadcastChannel<GoogleAuthChannel>(
    "google-auth-channel",
);

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
});

function handleOAuth(provider: Provider) {
    return Micro.tryPromise({
        try: async () => {
            switch (provider) {
                case "spotify": {
                    const searchParams = new URLSearchParams({
                        response_type: "code",
                        client_id: Env.SPOTIFY_CLIENT_ID,
                        scope: "user-read-private user-read-email",
                        redirect_uri: "http://localhost:42069/callback",
                    });

                    const url = new URL(
                        `https://accounts.spotify.com/authorize?${searchParams.toString()}`,
                    );

                    shell.openExternal(url.toString());

                    return {
                        status: "failed" as "failed" | "succeeded",
                    };
                }
                case "youtube": {
                    console.log(Env.GOOGLE_AUTH_SCOPES.split(","));

                    var token: string | null = null;

                    const url = googleOAuthClient.generateAuthUrl({
                        client_id: Env.GOOGLE_CLIENT_ID,
                        access_type: "offline",
                        scope: Env.GOOGLE_AUTH_SCOPES.split(","),
                        response_type: "code",
                        redirect_uri: "http://localhost:42069/googleredirect",
                    });

                    shell.openExternal(url);

                    googleAuthChannel.onmessage = (e) => {
                        console.log(e.token);
                        token = e.token as string;
                    };

                    return {
                        status: "successful",
                        token,
                    };
                }
            }
        },
        catch: (e) => new Error(String(e)),
    });
}

googleAuthChannel.onmessage = (e) => {
    console.log(e.token);
};
