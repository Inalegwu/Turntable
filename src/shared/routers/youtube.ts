import { publicProcedure, router } from "@src/trpc";

export const youtube = router({
    getPlaylists: publicProcedure.query(async ({ ctx }) => {
        const { data } = await ctx.youtube.playlists.list({
            part: [
                "contentDetails",
                "id",
                "snippet",
                "status",
            ],
            mine: true,
        });

        return {
            playlists: data.items?.map((item) => ({
                title: item.snippet?.title,
                desc: item.snippet?.description,
            })),
        };
    }),
});
