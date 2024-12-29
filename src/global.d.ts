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
    toggleColorMode: () => void;
    setAppId: (id: string) => void;
    authenticatedProviders: Map<Provider, {
      authenticated: boolean;
    }>;
    addAuthenticatedProviders: (
      provider: Provider,
      authenticated: boolean,
    ) => void;
  };

  export type Stage = {
    providers: Set<Provider>;
    addProvider: (provider: Provider) => void;
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
    addProvider: (provider: Provider, state: State) => void;
    addPlaylists: (list: Array<string>) => void;
  };

  export type GoogleAuthChannel = {
    code: string;
  };

  export type SpotifyAuthChannel = {
    token: AccessToken;
  };
}
