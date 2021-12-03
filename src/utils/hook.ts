import { useEffect, DependencyList } from 'react'

export const useAsyncEffect = (cb: () => void, deps: DependencyList) => {
  useEffect(() => {
    (async () => cb())()
  }, deps)
}
