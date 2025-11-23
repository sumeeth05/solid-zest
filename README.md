# ⚡️solid-zest

Lightweight, intuitive state management for Solid.js — inspired by Redux and Zustand.

- ⚛️ Native SolidJS reactivity
- ⚡ Zero-dependency core
- 🎯 Strong TypeScript support
- 🧩 Slice-based architecture
- 🔍 Built-in devtools logging
- 🔥 Lightweight (~700B gzipped)

## 🧠 How It Works

solid-zest lets you organize your global state into **slices**. A slice contains:

- a **name** to identify the slice
- **initial state**
- a set of **actions** that mutate the state (in-place, using Immer-style updates)

You then:

1. **Define** each slice using `defineSlice`.
2. **Combine** slices into a single store using `defineStore`.
3. **Create context access** using `createProvider`, which returns `StoreProvider` and `useStore`.
4. **Wrap your app** with `StoreProvider`.
5. **Access your state/actions** using the `useStore()` hook from anywhere in the component tree.

All state and actions are automatically **typed** and **reactive** — no dispatching, no selectors, no boilerplate.

## 📦 Installation

```bash
npm install solid-zest
```

## 📚 Step-by-Step Implementation

### 1. Create a Slice

Create a new file `store/counterSlice.ts`:

```tsx
import { defineSlice } from 'solid-zest';

export const counterSlice = defineSlice({
  name: 'counter',
  state: { count: 0 },
  actions: {
    increment: (state) => state.count++,
    decrement: (state) => state.count--,
    add: (state, value: number) => (state.count += value),
    reset: (state) => (state.count = 0),
  },
});
```

### 2. Configure the Store

Create a file `store/config.ts`:

```tsx
import { defineStore, createProvider } from 'solid-zest';
import { counterSlice } from './counterSlice';

const store = defineStore(
  {
    counter: counterSlice,
  },
  true
); // true enables devtools

const { StoreProvider, useStore } = createProvider<typeof store>();

export { store, StoreProvider, useStore };
```

### 3. Provide the Store in Root

Edit `index.tsx`:

```tsx
import { render } from 'solid-js/web';
import { StoreProvider, store } from './store/config';
import App from './App';

render(
  () => (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  ),
  document.getElementById('root')!
);
```

### 4. Use the Store in Components

Use state/actions directly with the useStore hook:

```tsx
import { useStore } from './store/config';

export default function App() {
  const store = useStore();

  return (
    <div>
      <h1>{store.counter.count}</h1>
      <button onclick={store.counter.increment}>+</button>
      <button onclick={store.counter.decrement}>-</button>
      <button onclick={() => store.counter.add(5)}>+5</button>
      <button onclick={store.counter.reset}>Reset</button>
    </div>
  );
}
```

### 🧪 Devtools

Enable logging with the second argument of `defineStore()`:

```tsx
const store = defineStore({ counter: counterSlice }, true);
```

Each action logs:

- 🏷 Slice + Action name

- 🔢 Payload

- 🟡 Before state

- 🟢 After state

### 📁 Suggested Folder Structure

```bash

src/
├── store/
│   ├── counterSlice.ts
│   ├── config.ts
├── App.tsx
└── index.tsx

```

### 🚫 Limitations

- State resets on full page reload (by design)

- No persistence or middleware support (yet)

- Devtools extension planned (console logs for now)

### ❤️ Inspired By

- Redux

- Zustand

- Solid primitives
