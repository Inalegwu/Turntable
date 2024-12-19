import { Env } from "@src/env";
import { publicProcedure, router } from "@src/trpc";
import { Micro } from "effect";
import { BrowserWindow } from "electron";
import { z } from "zod";
import { Provider } from "../validations";

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
            const authWindow = new BrowserWindow({
                frame: false,
                autoHideMenuBar: true,
                width: 300,
                height: 500,
                webPreferences: {
                    nodeIntegration: false,
                },
            });

            switch (provider) {
                case "spotify": {
                    const url = new URL(
                        "https://accounts.spotify.com/authorize",
                    );

                    url.searchParams.set("response_type", "code");
                    url.searchParams.set("client_id", Env.SPOTIFY_CLIENT_ID);
                    url.searchParams.set(
                        "scope",
                        "user-read-private user-read-email",
                    );
                    url.searchParams.set(
                        "redirect_uri",
                        "http://127.0.0.1:42069/oauthredirect",
                    );

                    authWindow.loadURL(url.toString());

                    const {
                        session: { webRequest },
                    } = authWindow.webContents;
                    const filter = {
                        urls: ["http://127.0.0.1:42069/oauthredirect/*"],
                    };
                    webRequest.onBeforeRequest(filter, async ({ url }) => {
                        const parsedUrl = new URL(url);
                        authWindow.close();
                        const code = parsedUrl.searchParams.get("code");
                        // Do the rest of the authorization flow with the code.
                        console.log({ code });
                    });

                    return {
                        status: "failed" as "failed" | "succeeded",
                    };
                }
                case "youtube":
            }
        },
        catch: (e) => new Error(String(e)),
    });
}
