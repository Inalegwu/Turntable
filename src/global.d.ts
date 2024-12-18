declare global {
  export type GlobalState = {
    colorMode: "dark" | "light";
    appId: string | null;
    firstLaunch: boolean;
  };

  export type Provider = "spotify" | "youtube";

  export type Transfer = {
    source: Provider;
    destination: Provider;
    date: string;
  };
}

export type {};
