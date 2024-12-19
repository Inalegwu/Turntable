import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config({
    path: ".env",
});

export const Env = cleanEnv(process.env, {
    SPOTIFY_CLIENT_ID: str(),
    SPOTIFY_CLIENT_SECRET: str(),
});
