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
  colorMode: "dark",
  appId: null,
  firstLaunch: false,
});

export const stage$ = observable<{
  providers: Array<Provider>;
}>({
  providers: [],
});

persistObservable(globalState$, {
  local: "global_state",
});
