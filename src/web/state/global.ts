import { create } from "zustand";
import { persist } from "zustand/middleware";

export const appState = create<GlobalState>()(persist((set) => ({
  appId: null,
  firstLaunch: true,
  colorMode: "light",
  authenticatedProviders: new Map<Provider, { authenticated: boolean }>(),
  toggleColorMode: () =>
    set((state) => ({
      ...state,
      colorMode: state.colorMode === "dark" ? "light" : "dark",
    })),
  setAppId: (appId) => set((state) => ({ ...state, appId })),
  addAuthenticatedProviders: (provider, authenticated) =>
    set((state) => {
      if (state.authenticatedProviders.has(provider)) {
        return state;
      }

      state.authenticatedProviders.set(provider, {
        authenticated,
      });

      return state;
    }),
}), {
  name: "app-state",
}));

export const stage = create<Stage>((set) => ({
  providers: new Set<Provider>(),
  addProvider: (provider) =>
    set((state) => {
      if (state.providers.has(provider)) {
        state.providers.delete(provider);
        return state;
      }
      state.providers.add(provider);

      return state;
    }),
}));

export const transfers = create<TransferState>((set) => ({
  providers: new Map<Provider, State>(),
  items: [],
  addProvider: (provider, direction) =>
    set((state) => {
      if (state.providers.has(provider)) {
        return state;
      }

      state.providers.set(provider, direction);

      return state;
    }),
  addPlaylists: (list) =>
    set((state) => ({ ...state, items: [...list, ...state.items] })),
}));
