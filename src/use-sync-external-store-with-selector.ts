import {
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'

type Inst<Selection> =
  | {
      hasValue: true
      value: Selection
    }
  | {
      hasValue: false
      value: null
    }

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  selector: (snapshot: Snapshot) => Selection,
  getServerSnapshot?: (() => Snapshot) | undefined,
  isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
  const instRef = useRef<Inst<Selection> | null>(null)
  let inst: Inst<Selection>

  if (instRef.current === null) {
    inst = { hasValue: false, value: null }
    instRef.current = inst
  } else {
    inst = instRef.current
  }

  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false
    let memoizedSnapshot: Snapshot
    let memoizedSelection: Selection

    const memoizedSelector = (nextSnapshot: Snapshot) => {
      if (!hasMemo) {
        hasMemo = true
        memoizedSnapshot = nextSnapshot

        const nextSelection = selector(nextSnapshot)

        if (isEqual !== undefined && inst.hasValue) {
          const currentSelection = inst.value
          if (isEqual(currentSelection, nextSelection)) {
            memoizedSelection = currentSelection
            return currentSelection
          }
        }

        memoizedSelection = nextSelection
        return nextSelection
      }

      const prevSnapshot = memoizedSnapshot
      const prevSelection = memoizedSelection

      if (Object.is(prevSnapshot, nextSnapshot)) {
        return prevSelection
      }

      const nextSelection = selector(nextSnapshot)

      if (isEqual?.(prevSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot
        return prevSelection
      }

      memoizedSnapshot = nextSnapshot
      memoizedSelection = nextSelection
      return nextSelection
    }

    const getSnapshotWithSelector = () => memoizedSelector(getSnapshot())
    const getServerSnapshotWithSelector =
      typeof getServerSnapshot === 'function'
        ? () => memoizedSelector(getServerSnapshot())
        : undefined

    return [getSnapshotWithSelector, getServerSnapshotWithSelector]
  }, [getSnapshot, getServerSnapshot, selector, isEqual])

  const value = useSyncExternalStore(
    subscribe,
    getSelection,
    getServerSelection,
  )

  useEffect(() => {
    inst.hasValue = true
    inst.value = value
  }, [value])

  useDebugValue(value)

  return value
}
