import {
    FileSystem,
    HttpRouter,
    HttpServer,
    HttpServerRequest,
    HttpServerResponse,
} from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { googleAuthChannel, spotifyAuthChannel } from "@shared/channels";
import type { AccessToken } from "@spotify/web-api-ts-sdk";
import { Env } from "@src/env";
import { Effect, Encoding, Layer } from "effect";
import { createServer } from "node:http";

const router = HttpRouter.empty.pipe(
    HttpRouter.get(
        "/ping",
        HttpServerResponse.json({
            res: "pong",
        }),
    ),
    HttpRouter.get(
        "/callback",
        Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const request = yield* HttpServerRequest.HttpServerRequest;
            const url = new URL(`http://localhost:42069/${request.url}`);

            yield* Effect.logInfo(url);

            const code = url.searchParams.get("code");

            if (!code) {
                return yield* HttpServerResponse.json({
                    successful: false,
                });
            }

            const token = yield* getSpotifyAccessToken(code);

            spotifyAuthChannel.postMessage({
                token,
            });

            return yield* HttpServerResponse.json({
                success: true,
            });
        }),
    ),
    HttpRouter.get(
        "/googleredirect",
        Effect.gen(function* () {
            const request = yield* HttpServerRequest.HttpServerRequest;

            const url = new URL(`http://localhost:42069/${request.url}`);
            const code = url.searchParams.get("code");

            if (!code) {
                return yield* HttpServerResponse.text(
                    "Connect YouTube account failed",
                );
            }

            googleAuthChannel.postMessage({
                code,
            });

            return yield* HttpServerResponse.text(
                "Connected YouTube Account Successfully",
            );
        }),
    ),
);

const App = router.pipe(
    Effect.annotateLogs({
        service: "oauth-redirect-server",
    }),
    Effect.tapError((e) => Effect.logError(e.toString())),
    HttpServer.serve(),
);

const Live = Layer.unwrapEffect(
    Effect.gen(function* () {
        yield* Effect.logInfo("Starting OAuth Redirect Server");

        return NodeHttpServer.layer(createServer, {
            port: 42069,
            host: "localhost",
        });
    }),
);

function getSpotifyAccessToken(code: string) {
    return Effect.gen(function* () {
        const authHeader = `Basic ${
            Encoding.encodeBase64(
                `${Env.SPOTIFY_CLIENT_ID}:${Env.SPOTIFY_CLIENT_SECRET}`,
            )
        }`;

        const token: AccessToken = yield* Effect.tryPromise({
            try: () =>
                fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        Authorization: authHeader,
                        "content-type": "application-x-www-form-urlencoded",
                    },
                    body: encodeFormData({
                        code,
                        redirect_uri: "http://127.0.0.1:42069/oauthredirect",
                        grant_type: "authorization_code",
                    }),
                }).then((res) => res.json()),
            catch: (e) => new Error(String(e)),
        });

        return token;
    });
}

function encodeFormData(data: object) {
    return Object.keys(data)
        .map(
            (key) =>
                // @ts-expect-error
                `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
        )
        .join("&");
}

export const Server = {
    Live: Layer.provide(App, Live).pipe(
        Layer.tapError((e) => Effect.logError(e)),
    ),
};
