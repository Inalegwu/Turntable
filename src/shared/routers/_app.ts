import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { oauth } from "./oauth";
import { transfer } from "./transfer";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  oauth,
  transfer,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
});

export type AppRouter = typeof appRouter;
