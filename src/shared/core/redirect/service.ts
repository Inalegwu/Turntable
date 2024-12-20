import { Effect, Layer } from "effect";
import { Server } from "./server";

const make = Effect.gen(function* () {
    yield* Effect.logInfo("Starting Redirect Service");

    yield* Effect.acquireRelease(
        Effect.logInfo("Started Redirect Service"),
        () => Effect.logInfo("Stopped Redirect Serveice"),
    );
});

export const RedirectService = Layer.scopedDiscard(make).pipe(
    Layer.provide(Server.Live),
    Layer.annotateLogs({
        service: "redirect-server",
    }),
);
