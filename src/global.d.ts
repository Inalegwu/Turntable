import type {
  Provider as PValidator,
  State as SValidator,
} from "@shared/validations";
import type { AccessToken } from "@spotify/web-api-ts-sdk";
import type { z } from "zod";

declare global {
  export type GlobalState = {
    colorMode: "dark" | "light";
    appId: string | null;
    firstLaunch: boolean;
  };

  export type Provider = z.infer<typeof PValidator>;

  export type Transfer = {
    source: Provider;
    destination: Provider;
    date: string;
  };

  export type State = z.infer<typeof SValidator>;

  export type TransferState = {
    providers: Map<Provider, State>;
    items: Array<string>;
  };

  export type GoogleAuthChannel = {
    code: string;
  };

  export type SpotifyAuthChannel = {
    token: AccessToken;
  };
}
