import { createContext, useContext, type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export type Slice<
  S,
  A extends Record<string, (state: S, ...args: any[]) => void>
> = {
  name: string;
  state: S;
  actions: A;
};

export function defineSlice<
  S,
  A extends Record<string, (state: S, ...args: any[]) => void>
>(slice: Slice<S, A>): Slice<S, A> {
  return slice;
}

export function defineStore<T extends Record<string, Slice<any, any>>>(
  slices: T,
  devtools = false
) {
  if (!slices || Object.keys(slices).length === 0) {
    console.warn('At least one slice must be provided');
  }

  const names = Object.values(slices).map((s) => s.name);
  const duplicates = names.filter(
    (name, index) => names.indexOf(name) !== index
  );
  if (duplicates.length > 0) {
    throw new Error(`Duplicate slice names found: ${duplicates.join(', ')}`);
  }

  const store: any = {};

  for (const key in slices) {
    const slice = slices[key];

    const [state, setState] = createStore(slice.state);

    const wrappedActions: Record<string, Function> = {};

    for (const actionName in slice.actions) {
      const actionFn = slice.actions[actionName] as (
        state: any,
        ...args: any[]
      ) => void;

      wrappedActions[actionName] = (...args: any[]) => {
        if (devtools) {
          console.group(`[${slice.name}] ${actionName}`);
          console.log('Before:', JSON.parse(JSON.stringify(state)));
          console.log('Payload:', args);
        }

        setState(
          produce((draft: any) => {
            actionFn(draft, ...args);
          })
        );

        if (devtools) {
          console.log('After:', JSON.parse(JSON.stringify(state)));
          console.groupEnd();
        }
      };
    }

    store[key] = {
      state: state,
      actions: wrappedActions,
    };
  }

  return store as {
    [K in keyof T]: {
      state: T[K]['state'];

      actions: {
        [A in keyof T[K]['actions']]: Parameters<T[K]['actions'][A]> extends [
          any,
          ...infer P
        ]
          ? (...args: P) => void
          : never;
      };
    };
  };
}

export function createProvider<T>() {
  const StoreContext = createContext<T | undefined>(undefined);

  function StoreProvider(props: { store: T; children: JSX.Element }) {
    return (
      <StoreContext.Provider value={props.store}>
        {props.children}
      </StoreContext.Provider>
    );
  }

  function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within a StoreProvider');
    return ctx;
  }

  return { StoreProvider, useStore };
}
