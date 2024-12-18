import { z } from "zod";

export const Provider = z.enum(["spotify", "youtube"]);
