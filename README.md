# 🍋 solid-zest

Lightweight, intuitive state management for Solid.js. Inspired by Redux Toolkit and Zustand, but engineered specifically for Solid's fine-grained reactivity.

## ✨ Features

- **⚛️ Native Reactivity:** Built directly on Solid's createStore and produce.
- **⚡ Zero "Spread" Penalty:** Separates state access from actions to prevent accidental re-renders.
- **🚀 Tiny Footprint:** Zero dependencies and ultra-lightweight (~700B gzipped).
- **🎯 TypeScript First:** Automatic type inference for state and actions—no boilerplate.
- **🧩 Slice Architecture:** Organize complex state into modular, manageable chunks.
- **🛠 Built-in Logging:** Simple console-based devtools for debugging state changes.

## 🧠 Why solid-zest?

Most SolidJS store libraries merge state and actions into a single object. This can lead to reactivity leaks: if a component destructures an action from the store, it might accidentally subscribe to the entire state object (depending on implementation), causing unnecessary re-renders.

solid-zest enforces a strict separation:

- `slice.state:` A reactive Proxy (tracked by Solid).
- `slice.actions:` A static object of functions (untracked).

This ensures your components only re-render when the specific data they consume changes.

## 📦 Installation

```bash
npm install solid-zest
# or
pnpm add solid-zest
# or
yarn add solid-zest
```

## 📚 Quick Start

### 1. Define a Slice

Create a file `store/store.ts`. And Create a slice with an initial state and actions.

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

Create a file `store/config.ts`. And Combine your slices into a single store and export the provider.

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

### 3. Wrap Your App

In `index.tsx` Provide the store at the root of your application.

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

### 4. Use in Components

Use state/actions directly with the useStore hook:

```tsx
import { useStore } from './store/config';

export default function App() {
  const { counter } = useStore();

  return (
    <div>
      <h1>{counter.state.count}</h1>
      <button onclick={counter.actions.increment}>+</button>
      <button onclick={counter.actions.decrement}>-</button>
      <button onclick={() => counter.actions.add(5)}>+5</button>
      <button onclick={counter.actions.reset}>Reset</button>
    </div>
  );
}
```

### 🧪 Devtools

You can enable built-in console logging to track state changes during development.
Pass `true` as the second argument to `defineStore`:

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

### ❤️ Inspired By

- Redux
- Zustand
- Solid primitives
