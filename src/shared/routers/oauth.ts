import { publicProcedure, router } from "@src/trpc";

export const oauth = router({
    spotifyOAuth: publicProcedure.mutation(async () => {}),
    googleOAuth: publicProcedure.mutation(async () => {}),
});
