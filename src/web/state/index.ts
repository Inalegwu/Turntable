import type { StoreApi, UseBoundStore } from "zustand";
import * as state from "./global";

type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
    _store: S,
) => {
    const store = _store as WithSelectors<typeof _store>;
    store.use = {};
    for (const k of Object.keys(store.getState())) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
    }

    return store;
};

export const appState = createSelectors(state.appState);
export const stage = createSelectors(state.stage);
export const transfers = createSelectors(state.transfers);
