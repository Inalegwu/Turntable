import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import type { AccessToken } from "@spotify/web-api-ts-sdk";
import { Env } from "@src/env";
import { Effect, Encoding, Layer } from "effect";
import { createServer } from "node:http";

const router = HttpRouter.empty.pipe(
    HttpRouter.post(
        "/oauthredirect",
        Effect.gen(function* () {
            return yield* HttpServerResponse.json({
                foo: "bar",
            });
        }),
    ),
);

const App = router.pipe(
    Effect.annotateLogs({
        service: "oauth-redirect-server",
    }),
    HttpServer.serve(),
);

const Live = Layer.unwrapEffect(
    Effect.gen(function* () {
        yield* Effect.logInfo("Starting OAuth Redirect Server");

        return NodeHttpServer.layer(createServer, {
            port: 42069,
            host: "127.0.0.1",
        });
    }),
);

function getAccessToken(code: string) {
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
    return Object.keys(data).map(
        // @ts-expect-error
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
    ).join("&");
}

export const Server = {
    Live: Layer.provide(App, Live),
};
