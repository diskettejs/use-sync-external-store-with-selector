# use-sync-external-store-with-selector

This package is just the [useSyncExternalStoreWithSelector](https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js) hook extracted from React's [shim for `useSyncExternalStore`](https://github.com/facebook/react/blob/main/packages/use-sync-external-store/README.md).

## Installation

```bash
pnpm add use-sync-external-store-with-selector
```

```bash
npm install use-sync-external-store-with-selector
```

## Changes

- Uses `Object.is` instead of a [inlined polyfill](https://github.com/facebook/react/blob/47664deb8e981ec0425731495be1c5826ce90956/packages/shared/objectIs.js).
- Argument order, switched the `getServerSnapshot` with `selector`:

Original:

```ts
useSyncExternalStoreWithSelector(
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual,
)
```

Updated

```ts
useSyncExternalStoreWithSelector(
  subscribe,
  getSnapshot,
  selector,
  getServerSnapshot,
  isEqual,
)
```
