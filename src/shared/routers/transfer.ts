import { publicProcedure, router } from "@src/trpc";
import { z } from "zod";
import { Provider, State } from "../validations";

export const transfer = router({
    beginTransfer: publicProcedure.input(z.object({
        transferState: z.object({
            provider: Provider,
            state: State,
        }),
        items: z.array(z.string()),
    })).mutation(async ({ input }) => {
        console.log(input);
    }),
});
