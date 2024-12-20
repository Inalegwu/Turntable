import { Env } from "@src/env";
import type { inferAsyncReturnType } from "@trpc/server";
import { BrowserWindow } from "electron";
import { google } from "googleapis";
import { store } from "./storage";

export const googleOAuthClient = new google.auth.OAuth2(
  Env.GOOGLE_CLIENT_ID,
  Env.GOOGLE_CLIENT_SECRET,
  "http://localhost:42069/googleredirect",
);  

const youtube=google.youtube({
  version:"v3"
});

export async function createContext() {
  const browserWindow = BrowserWindow.getFocusedWindow();

  return {
    window: browserWindow,
    store,
    youtube
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
