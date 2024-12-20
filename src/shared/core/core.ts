import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { parentPort } from "node:worker_threads";
import { RedirectService } from "./redirect/service";

const port = parentPort;

if (!port) throw new Error("COREMSG==> Invalid Port");

const App = Layer.mergeAll(RedirectService);

port.on("message", () => NodeRuntime.runMain(Layer.launch(App)));
