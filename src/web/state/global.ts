import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  appId: null,
  firstLaunch: false,
});

type Authenticated = {
  authenticated: boolean;
  provider: Provider;
};

export const authenticated$ = observable<{
  providers: Map<Provider, Authenticated>;
}>({
  providers: new Map<Provider, Authenticated>(),
});

export const stage$ = observable<{
  providers: Set<Provider>;
}>({
  providers: new Set<Provider>(),
});

persistObservable(globalState$, {
  local: "global_state",
});
