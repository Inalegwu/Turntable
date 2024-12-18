import { publicProcedure, router } from "@src/trpc";
import { z } from "zod";
import { Provider } from "../validations";

export const oauth = router({
    attemptOAuth: publicProcedure.input(z.object({
        provider: Provider,
    })).mutation(async ({ input }) => {
        console.log(input);
        switch (input.provider) {
            case "spotify": {
                return;
            }
            case "youtube": {
                return;
            }
        }
    }),
});
