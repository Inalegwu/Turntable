import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";

const router = HttpRouter.empty.pipe(
    HttpRouter.post(
        "/oauthredirect",
        Effect.gen(function* () {
            return yield* HttpServerResponse.json({});
        }),
    ),
);

const App = router.pipe(
    Effect.annotateLogs({
        service: "oauth-server",
    }),
    HttpServer.serve(),
);

const Live = Layer.unwrapEffect(Effect.gen(function* () {
    yield* Effect.logInfo("Starting OAuth Redirect Server");

    return NodeHttpServer.layer(createServer, {
        port: 42069,
        host: "localhost",
    });
}));

export const RedirectServer = Layer.provide(App, Live);
