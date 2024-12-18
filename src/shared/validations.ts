import { z } from "zod";

export const Provider = z.enum(["spotify", "youtube"]);

export const State = z.enum(["source", "destination"]);
